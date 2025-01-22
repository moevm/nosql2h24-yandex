import "./Logs.css";
import searchIcon from "/search.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogs } from "../store/log-slice";

import { setLogSearchValues } from "../store/logSearch-slice.jsx"

export default function LogsHeader() {
    const dispatch = useDispatch();

    let logSearchValues = useSelector((state) => state.logSearch.logSearchValues)

    const initialValues = {
        form_id: "",
        to_date: "",
        from_date: "",
        edit_mail: "",
        edit_action: "",
        event_type: "",
    };
    const [values, setValues] = useState(initialValues);

    const handleDateChange = async (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        dispatch(setLogSearchValues({ ...values, [event.target.name]: event.target.value }))
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        dispatch(setLogSearchValues({ ...values, [name]: value }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const filteredInitialValues = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== "")
        );

        filteredInitialValues["size"] = 5
        filteredInitialValues["page"] = 0
        let url = new URL('http://localhost:8080/logs/search');
        const params = new URLSearchParams(filteredInitialValues);
        url.search = params.toString();
        try {
            const response = await fetch(url.href, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            dispatch(setLogs(data));

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    return (
        <div className="main_header">
            <h1>
                <span>И</span>стория изменений
            </h1>

            <form className="inputs" onSubmit={handleSubmit}>
                <input name="form_id" onChange={handleChange} type="text" className="text-field__input" placeholder="ID" />
                <input name="event_type" onChange={handleChange} type="text" className="text-field__input" placeholder="Тип" />
                <input name="edit_mail" onChange={handleChange} type="text" className="text-field__input" placeholder="Кто" />
                <input name="edit_action" onChange={handleChange} type="text" className="text-field__input" placeholder="Действие" />
                <div className="date-inputs">
                    <div className="dateTitle"><p>Дата</p></div>
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
