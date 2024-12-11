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
    
    const testClick = async(event) => {
        let isCloseButton = event.target.closest(".exit_button")
        let Form = event.target.closest(".container")
        // if (isCloseButton) {
        //     let formIdToDelete = Form.dataset.id
        //     await axios.post("http://localhost:8080/forms/delete", { ownerMail: mail, idToDelete: formIdToDelete });

        //     const res = await axios.get(`http://localhost:8080/forms/${mail}`);
        //     dispatch(setBrokers(res.data));
        // }
    }


    return (
        <div className="container" data-id={props.id} onClick={testClick}>
            <TableHeader title={props.name} />

            <div className="upper_buttons" >
                <Button text="Таблица" getTable={goTables}></Button>
                <Button text="Форма"></Button>
            </div>
            <div className="low_buttons">
                <Button text="Статистика и история"></Button>
                <Button text="Настройки доступа"></Button>
            </div>
        </div>
    )
}