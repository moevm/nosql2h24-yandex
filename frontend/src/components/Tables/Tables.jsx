import Header from "./Header.jsx"
import Table from "./Table.jsx";
import MainHeader from "./MainHeader.jsx";
import { useState } from 'react';
import axios from "axios"

import {useDispatch, useSelector} from "react-redux";
import React, { useRef } from 'react';
import { setBrokers } from "../store/broker-slice.jsx"

export default function Tables() {
    const dispatch = useDispatch();
    let mail = localStorage.getItem("mail")

    const [name, setName] = useState('');

    let forms = useSelector((state) => state.broker.brokers);

    const handleSubmit = async () => {
    
        try {
            await axios.post("http://localhost:8080/forms/create-form", { ownerMail: mail, name: name });
    
            const res = await axios.get(`http://localhost:8080/forms/${mail}`);
            dispatch(setBrokers(res.data));
            
        } catch (error) {
            console.error("Ошибка при обработке форм: ", error);
        }
    };
    const exportData = () => {
        axios.get("http://localhost:8080/forms/export").then((response) => {
            const link = document.createElement('a');
            link.setAttribute('download', 'data.json'); 
            const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
            link.href = URL.createObjectURL(blob);
            
            link.click();
        });
    }

    const fileInputRef = useRef(null);

    const importData = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0]; // Получаем выбранный файл
        console.log(selectedFile, "Asd");
        if (selectedFile) {
            const formData = new FormData(); // Создание объекта FormData для передачи файла
            formData.append('jsonFile', selectedFile); // Добавляем файл в форму
            try {
                await axios.post("http://localhost:8080/forms/import", formData).then(response => {
                    console.log('Импорт завершен успешно!', response);
                })

                const res = await axios.get(`http://localhost:8080/forms/${mail}`);
                console.log("new datas", res.data);
                dispatch(setBrokers(res.data));
            } catch (error) {
                console.error("Ошибка при обработке форм: ", error);
            }
        }
    };

    return (
        <div>
            <Header />
            <main>
                <MainHeader></MainHeader>
                
                <div className="add_transfer">
                    <input type="text" className="text-field__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название формы"/>
                    <button className="search_button" onClick={handleSubmit}><strong>Добавить связь</strong></button>

                    <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
                    <button className="search_button" onClick={importData}><strong>Импорт</strong></button>
                
                    <button className="search_button" onClick={exportData}><strong>Экспорт</strong></button>
                </div>

                <div className="main_tables">
                    {(() => {
                        const options = [];
                        for (let i = 0; i < forms.length; i++) {
                            options.push(<Table id={forms[i].id} key={i} name={forms[i].name}/>);
                        }
                        return options;
                    })()}

                </div>
            </main>
        </div>
    )
}