import TableHeader from "./TableHeader.jsx";
import Button from "./Button.jsx";
import { useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { setXlsx, setName } from "../store/xlsx-slice.jsx";
import axios from "axios"
import { setBrokers } from "../store/broker-slice.jsx"



export default function Table(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let mail = localStorage.getItem("mail")

    const goTables = async () => {
        try {
            const response = await fetch(`http://localhost:8080/forms/table/${props.id}`)
            const arrayBuffer = await response.arrayBuffer();
            let data = new Uint8Array(arrayBuffer)
            dispatch(setXlsx(data));
            dispatch(setName(props.name));

            navigate("/xlsx");
        } catch (error) {
            console.error("Ошибка", error);
        }
    }


    return (
        <div className="container" data-id={props.id} onClick={testClick}>
            <TableHeader title={props.name} />

            <div className="upper_buttons" >
                <Button text="Таблица" click={goTables}></Button>
                <Button text="Форма"></Button>
            </div>
            <div className="low_buttons">
                <Button text="Статистика и история"></Button>
                <Button text="Настройки доступа"></Button>
            </div>
        </div>
    )
}