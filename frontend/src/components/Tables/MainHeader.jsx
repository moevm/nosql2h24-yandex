import "./MainHeader.css";
import searchIcon from "/search.svg";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBrokers } from "../store/broker-slice.jsx"

export default function MainHeader() {
    const dispatch = useDispatch();

    // Стартовые значения параметров
    const initialValues = {
        creation_date: "",
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
                    placeholder="Название таблицы"
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
                <input
                    id="creation_date"
                    name="creation_date"
                    value={values.creation_date}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Дата созданиия"
                ></input>
                <input
                    id="redactor"
                    name="redactor"
                    value={values.redactor}
                    onChange={handleChange}
                    type="text"
                    className="text-field__input"
                    placeholder="Реадакторы"
                ></input>
                <button type="submit" className="search_button">
                    <img src={searchIcon}></img>
                    <strong>Поиск</strong>
                </button>
            </form>
        </div>
    );
}
