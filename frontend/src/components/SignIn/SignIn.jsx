import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import YandexIcon from "/Yandex_icon.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBrokers } from "../store/broker-slice.jsx";

export default function SignIn() {
    const dispatch = useDispatch();
    let brokers = useSelector((state) => state.broker.brokers);
    const [input, setInput] = useState("");

    const navigate = useNavigate();
    let [data1, setData1] = useState();
    let [data2, setData2] = useState();

    const toTables = async () => {
        localStorage.setItem("mail", input);
        console.log("mail -", input);
        try {
            let user = await axios.get(`http://localhost:8080/users/${input}`, { mail: input })
            console.log("user", user.status);

            await axios.get(`http://localhost:8080/forms/${input}`).then((res) => {
                dispatch(setBrokers(res.data));
                setData2(res.data);
            });

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
