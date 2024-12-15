import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import YandexIcon from "/Yandex_icon.svg";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBrokers } from "../store/broker-slice.jsx";
import { setUsers } from "../store/user-slice.jsx";

export default function SignIn() {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");

    const navigate = useNavigate();

    const toTables = async () => {
        localStorage.setItem("mail", input);
        try {
            let user = await axios.get(`http://localhost:8080/users/${input}`, { mail: input })

            await axios.get(`http://localhost:8080/forms/${input}`).then((res) => {
                dispatch(setBrokers(res.data));
                dispatch(setUsers({
                    "sashaOwner@mail.ru": false,
                    "senyaRedactor@mail.ru": false,
                    "vlas_vozmitel@mail.ru": false
                  }))
            })
            // let id = 0
            // await axios.get(`http://localhost:8080/forms/available/redactors/${id}`).then((res) => {
            //     console.log("res - ", res.data);
            //     dispatch(setUsers({
            //         "sashaOwner@mail.ru": false,
            //         "senyaRedactor@mail.ru": false,
            //         "vlas_vozmitel@mail.ru": false
            //       }))
            // })

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
