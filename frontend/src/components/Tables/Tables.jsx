import Header from "./Header.jsx"
import Table from "./Table.jsx";
import MainHeader from "./MainHeader.jsx";
import { useState } from 'react';
import axios from "axios"

import {useDispatch, useSelector} from "react-redux";
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
    
    return (
        <div>
            <Header />
            <main>
                <MainHeader></MainHeader>
                
                <div className="add_transfer">
                    <input type="text" className="text-field__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название формы"/>
                    <button className="search_button" onClick={handleSubmit}><strong>Добавить связь</strong></button>
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