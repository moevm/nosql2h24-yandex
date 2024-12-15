import "./MainHeader.css";
import searchIcon from "/search.svg";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBrokers } from "../store/broker-slice.jsx"
import { useSelector } from "react-redux";

export default function MainHeader() {
    const dispatch = useDispatch();
    let forms = useSelector((state) => state.broker.brokers);

    // Стартовые значения параметров
    const initialValues = {
        to_date:"",
        from_date: "",  
        owner_mail: "",
        redactor: "",
        table_name: "",
    };

    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const filteredInitialValues = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== "")
        );

        let url = new URL('http://localhost:8080/forms/table');
        const params = new URLSearchParams(filteredInitialValues);
        url.search = params.toString();
        console.log("url - ", url.href);
        try {
            const response = await fetch(url.href, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            dispatch(setBrokers(data));

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    // let initialDates = {
    //     "before": "",
    //     "after": ""
    // }
    
    //const [selectedDate, setSelectedDate] = useState(initialDates);
    const handleDateChange = async (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        //setSelectedDate({...selectedDate, [event.target.name]: event.target.value });
    };

    return (
        <div className="main_header">
            <h1>
                <span>Т</span>аблицы
            </h1>

            <form className="inputs" onSubmit={handleSubmit}>
                <input
                    id="table_name"
                    name="table_name"
                    value={values.table_name}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Название формы"
                ></input>
                <input
                    id="owner_mail"
                    name="owner_mail"
                    value={values.owner_mail}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Владелец"
                ></input>
                {/* <input
                    id="creation_date"
                    name="creation_date"
                    value={values.creation_date}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Дата созданиия"
                ></input> */}
                <input
                    id="redactor"
                    name="redactor"
                    value={values.redactor}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Редакторы"
                ></input>
                <div className="date-inputs">
                    <div className="dateTitle"><p>Дата создания</p></div>
                    <input type="date" id="date-input__before" name="from_date" className="text-field__input" placeholder="С" onChange={handleDateChange}></input>

                    <strong>-</strong>
                    <input type="date" id="date-input__after" name="to_date" className="text-field__input" placeholder="По" onChange={handleDateChange}></input>
                </div>
                <button type="submit" className="search_button">
                    <img src={searchIcon}></img>
                    <strong>Поиск</strong>
                </button>
            </form>

        </div>
    );
}
