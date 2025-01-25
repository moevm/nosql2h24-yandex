import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Stats = () => {
    const navigate = useNavigate();
    const [yValue, setYValue] = useState("forms");
    const [xValueForms, setXValueForms] = useState("date");
    const [xValueLogs, setXValueLogs] = useState("type");

    let logTypes = [
        "Отправка",
        "Экспорт",
        "Импорт",
        "Исправление",
        "Удаление",
        "Изменение",
    ];
    let allUsers = useSelector((state) => state.user.users);
    const [labels, setLabels] = useState([]);
    const [counts, setCounts] = useState([]);
    let mail = localStorage.getItem("mail");
    const [chart_data, setChart] = React.useState({
        datasets: [
            {
                label: "Количество форм/логов",
            },
        ],
    });
    const handleFirst = (e) => {
        setYValue(e.target.value);

        let secondSelect = document.querySelector(".second-select");
        let thirdSelect = document.querySelector(".third-select");

        if (e.target.value === "logs") {
            secondSelect.setAttribute("hidden", "");
            thirdSelect.removeAttribute("hidden");
        } else if (e.target.value === "forms") {
            thirdSelect.setAttribute("hidden", "");
            secondSelect.removeAttribute("hidden");
        }
    };
    let handleForms = (e) => {
        setXValueForms(e.target.value);
    };
    let handleLogs = (e) => {
        setXValueLogs(e.target.value);
        // if (e.target.value === "when") {
        //     let statsModal = document.querySelector(".stats-modal-overlay");
        //     statsModal.classList.remove("stats-modal-overlay_hidden");
        // }
    };
    let handleClick = async () => {
        if (yValue === "forms" && xValueForms === "date") {
            const res = await axios.get(
                `http://localhost:8080/forms/${mail}?page=${0}&size=${1000}`
            );
            let [dates, counts] = groupByDate(res.data.forms);
            setChart({
                labels: dates,
                datasets: [
                    {
                        label: "Количество форм",
                        backgroundColor: "#F8604A",
                        borderColor: "#F8604A",
                        data: counts, // Здесь нужно заменить значения данными из вашего примера
                    },
                ],
            });
        } else if (yValue === "forms" && xValueForms === "redactors") {
            const res = await axios.get(
                `http://localhost:8080/forms/${mail}?page=${0}&size=${1000}`
            );
            let [emails, counts] = groupByRedactors(res.data.forms, allUsers);
            setChart({
                labels: emails,
                datasets: [
                    {
                        label: "Количество форм",
                        backgroundColor: "#F8604A",
                        data: counts, // Здесь нужно заменить значения данными из вашего примера
                    },
                ],
            });
        }
        if (yValue === "logs" && xValueLogs === "type") {
            const res = await axios.get(
                `http://localhost:8080/logs?page=${0}&size=${10000}`
            );
            let [types, counts] = groupByTypes(res.data.logs, logTypes);
            console.log(res.data.logs);
            setChart({
                labels: types,
                datasets: [
                    {
                        label: "Количество логов",
                        backgroundColor: "#a60000",
                        data: counts, // Здесь нужно заменить значения данными из вашего примера
                    },
                ],
            });
        } else if (yValue === "logs" && xValueLogs === "who") {
            console.log("who");
        } else if (yValue === "logs" && xValueLogs === "when") {
            const res = await axios.get(
                `http://localhost:8080/logs?page=${0}&size=${10000}`
            );
            let [dates, counts] = groupByEditTime(res.data.logs)
            setChart({
                labels: dates,
                datasets: [
                    {
                        label: "Количество логов",
                        backgroundColor: "#a60000",
                        data: counts, // Здесь нужно заменить значения данными из вашего примера
                    },
                ],
            });
        }
    };

    function groupByDate(data) {
        const dates = [];
        const counts = [];

        data.forEach((item) => {
            const dateStr = item.date.substring(0, 10); // Берем первые 10 символов строки даты
            if (!dates.includes(dateStr)) {
                dates.push(dateStr);
                counts.push(1);
            } else {
                const index = dates.indexOf(dateStr);
                counts[index]++;
            }
        });

        return [dates, counts];
    }
    function groupByEditTime(data) {
        const dates = [];
        const counts = [];

        data.forEach((item) => {
            const dateStr = item.editTime.substring(0, 10); // Берем первые 10 символов строки даты
            if (!dates.includes(dateStr)) {
                dates.push(dateStr);
                counts.push(1);
            } else {
                const index = dates.indexOf(dateStr);
                counts[index]++;
            }
        });

        return [dates, counts];
    }
    function groupByRedactors(forms, redactors) {
        // Создаем объект для хранения счетчиков
        const editorCounts = {};

        // Проходимся по всем формам
        forms.forEach((form) => {
            form.redactors.forEach((email) => {
                if (!editorCounts[email]) {
                    editorCounts[email] = 0;
                }
                editorCounts[email]++;
            });
        });

        // Формируем результирующие массивы
        const emails = Object.keys(editorCounts);
        const counts = emails.map((email) => editorCounts[email]);

        redactors.forEach((redactor) => {
            if (!emails.includes(redactor.email)) {
                emails.push(redactor.email);
                counts.push(0);
            }
        });

        return [emails, counts];
    }
    function groupByTypes(logs, eventTypes) {
        // Создаем объект для хранения счетчиков
        const typeCounts = {};

        // Инициализируем счетчики нулями
        eventTypes.forEach((type) => {
            typeCounts[type] = 0;
        });

        // Проходимся по каждому элементу массива и обновляем счетчики
        logs.forEach((event) => {
            typeCounts[event.eventType]++;
        });

        // Формируем результирующие массивы
        const types = eventTypes.slice(); // Копия массива известных типов
        const counts = types.map((type) => typeCounts[type]);

        return [types, counts];
    }
    function groupByDates(logs, dateRange) {
        const fromDate = new Date(
            dateRange.from_date !== "" ? dateRange.from_date + " 00:00:00" : "2000-01-01"
        );
        const toDate = new Date(
            dateRange.to_date !== "" ? dateRange.to_date + " 23:59:59" : "3000-01-01");


        // // Парсим границы диапазона дат
        // const fromDate = new Date(dateRange.from_date);
        // const toDate = new Date(dateRange.to_date);

        // Фильтруем логи по диапазону дат
        const filteredLogs = logs.filter(log => {
            const logDate = new Date(log.editTime.substring(0, 10));
            return logDate >= fromDate && logDate <= toDate;
        });

        // Создаем объект для хранения дат и их частот
        const dateCounts = {};

        // Подсчитываем количество записей для каждой даты
        filteredLogs.forEach(log => {
            const logDateStr = log.editTime.substring(0, 10); // Берём только дату без времени
            if (!dateCounts[logDateStr]) {
                dateCounts[logDateStr] = 0;
            }
            dateCounts[logDateStr]++;
        });

        // Формируем результирующие массивы
        const dates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b)); // Сортируем даты
        const counts = dates.map(date => dateCounts[date]);

        return [dates, counts];
    }

    const initialValues = {
        from_date: "",
        to_date: "",
    };
    const [dataValues, setDateValues] = useState(initialValues);
    const handleDateChange = async (event) => {
        setDateValues({ ...dataValues, [event.target.name]: event.target.value });
    };
    let closeModal = (event) => {
        let statsModal = event.target.closest(".stats-modal-overlay");
        statsModal.classList.add("stats-modal-overlay_hidden");
    }



    return (
        <div>
            <h1>Общая статистика</h1>
            <div className="stats">
            <button className="search_button" onClick={() => {navigate("/tables")}}>
                            <strong>Вернуться</strong>
                        </button>
                <div className="first-select">
                    <strong>Y - </strong>
                    <select onChange={handleFirst}>
                        <option value="forms">Количество форм</option>
                        <option value="logs">Количество логов</option>
                    </select>
                </div>

                <div className="second-select">
                    <strong>X - </strong>
                    <select name="forForm" onChange={handleForms}>
                        <option value="date">По датам</option>
                        <option value="redactors">По редакторам</option>
                    </select>
                </div>

                <div className="third-select" hidden>
                    <strong>X - </strong>
                    <select name="forLogs" onChange={handleLogs}>
                        <option value="type">По типу события</option>
                        <option value="when">По датам</option>
                    </select>
                </div>

                <button className="search_button" onClick={handleClick}>
                    Отобразить
                </button>
            </div>

            <main>
                <div className="stats-diagram">
                    <Bar
                        data={chart_data}
                        options={{
                            scales: {
                                y: {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1,
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </main>

            <div className="stats-modal-overlay stats-modal-overlay_hidden">
                <div className="stats-modal">
                    <h3 className="stats-modal__question">
                        Выберите дату или диапазон
                    </h3>
                    <div className="date-inputs" >
                        <input type="date" id="date-input__before" name="from_date" className="text-field__input" placeholder="С" onChange={handleDateChange}></input>

                        <strong>-</strong>
                        <input type="date" id="date-input__after" name="to_date" className="text-field__input" placeholder="По" onChange={handleDateChange}></input>
                    </div>
                    <div className="stats-modal__buttons">
                        <button className="search_button date_but" onClick={closeModal}>Отмена</button>
                        <button className="search_button date_but" onClick={closeModal}>Сохранить</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Stats;
