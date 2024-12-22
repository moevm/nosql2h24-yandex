import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import YandexIcon from "/Yandex_icon.svg";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBrokers } from "../store/broker-slice.jsx";
import { setUsers } from "../store/user-slice.jsx";

export default function SignIn() {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    let forms = useSelector((state) => state.broker.brokers);
    let size = 6
    localStorage.setItem("size", size);

    const navigate = useNavigate();

    const toTables = async () => {
        localStorage.setItem("mail", input);
        try {
            let user = await axios.get(`http://localhost:8080/users/${input}`, { mail: input })
            let foundItem = {}
            await axios.get(`http://localhost:8080/forms/${input}?page=${0}&size=${size}`).then((res) => {
                console.log("object", res.data);
                dispatch(setBrokers(res.data));

                foundItem = res.data.forms.find(item => item.ownerEmail === input);
            })
            if(foundItem){
                await axios.get(`http://localhost:8080/forms/available/redactors/${foundItem.id}`).then((res) => {
                    dispatch(setUsers(res.data))
                })
            }
            else{
                dispatch(setUsers([]))
            }


            navigate("/tables");
        } catch (error) {
            console.error("Ошибка", error);
        }
    };

    return (
        <div className="SignIn">
            <div className="In">
                <p>
                    <strong>Яндекс </strong>
                    <span className="SignInSpan">Трансфер</span>
                </p>
                <p>
                    <strong>Войти с помощью Яндекса</strong>
                </p>
                <input
                    id="login"
                    type="text"
                    className="text-field__input"
                    placeholder="Почта"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                ></input>

                <button className="yandex" onClick={toTables}>
                    <img src={YandexIcon}></img>
                </button>
            </div>
        </div>
    );
}
