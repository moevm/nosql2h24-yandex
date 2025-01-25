import "./TablesXlsx.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import "./select.css";
import searchIcon from "/search.svg";
import Button from "../Tables/Button";
import "../Tables/modalCss.css";
import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export function TablesXlsx() {
    const navigate = useNavigate();
    let xlsx = useSelector((state) => state.xlsx.bytes);
    let name = useSelector((state) => state.xlsx.name);
    let initialDates = {
        before: "",
        after: "",
    };
    const [chart_data, setChart] = React.useState({
        labels: [],
        datasets: [
            {}
        ]
    });
    const [selectedDate, setSelectedDate] = useState(initialDates);
    const [table, setTable] = useState("");
    const [tmp_table, setTmpTable] = useState("");
    const [ID, setID] = useState("");
    const [selectedOption, setSelectedOption] = useState("default");

    const [amount, setAmount] = useState("");

    const handleIdChange = (event) => {
        setID(event.target.value);
    };
    const handleDateChange = (event) => {
        setSelectedDate({
            ...selectedDate,
            [event.target.name]: event.target.value,
        });
    };
    const handleChange = (event) => {
        setSelectedOption(event.target.value);

        switch (event.target.value) {
            case "new":
                displayData(sortByCreationTimeDescending(tmp_table));
                break;
            case "old":
                displayData(sortByCreationTimeAscending(tmp_table));
                break;
            default:
                break;
        }
    };

    function parseDate(dateString) {
        return new Date(dateString);
    }
    // Фильтрация строк таблицы по диапазону дат
    function filterByDateRange(table, startDate, endDate) {
        startDate = new Date(
            startDate !== "" ? startDate + " 00:00:00" : "2000-01-01"
        );
        endDate = new Date(endDate !== "" ? endDate + " 23:59:59" : "3000-01-01");

        if (table.length > 1) {
            let headerRow = table.shift(); // Убираем заголовок таблицы
            let filteredRows = table.filter((row) => {
                let rowDate = parseDate(row[1]);
                return rowDate >= startDate && rowDate <= endDate;
            });
            filteredRows.unshift(headerRow); // Возвращаем заголовок обратно
            table.unshift(headerRow); // Возвращаем заголовок обратно

            setTmpTable(filteredRows)
            return filteredRows;
        }

        return table;
    }
    // Сортировка строк таблицы по времени создания (по возрастанию)
    function sortByCreationTimeAscending(table) {
        if (table.length > 1) {
            let headerRow = table.shift(); // Убираем заголовок таблицы
            let sortedRows = table.sort((a, b) => {
                let dateA = parseDate(a[1]);
                let dateB = parseDate(b[1]);
                if (dateA > dateB) return 1;
                else if (dateA < dateB) return -1;
                else return 0;
            });
            table.unshift(headerRow); // Возвращаем заголовок обратно
            // sortedRows.unshift(headerRow);
            // return sortedRows;
        }
        return table;
    }
    // Сортировка строк таблицы по времени создания (по убыванию)
    function sortByCreationTimeDescending(table) {
        if (table.length > 1) {
            let headerRow = table.shift(); // Убираем заголовок таблицы
            let sortedRows = table.sort((a, b) => {
                let dateA = parseDate(a[1]);
                let dateB = parseDate(b[1]);
                if (dateA > dateB) return -1;
                else if (dateA < dateB) return 1;
                else return 0;
            });
            //sortedRows.unshift(headerRow);
            table.unshift(headerRow); // Возвращаем заголовок обратно
            // return sortedRows;
        }
        return table;
    }

    const IDBut = () => {
        if (ID !== "") {
            let headerRow = table.shift();
            let answer = table.filter((row) => {
                return ID === row[0];
            });
            answer.unshift(headerRow);
            table.unshift(headerRow);
            displayData(answer);
        } else {
            displayData(tmp_table);
        }
    };

    const seacrhBut = () => {
        let newT = sortByCreationTimeAscending(table);
        displayData(
            filterByDateRange(newT, selectedDate.before, selectedDate.after)
        );
    };

    useEffect(() => {
        if (xlsx) {
            const workbook = XLSX.read(xlsx, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            setTable(jsonData);
            setTmpTable(jsonData);
            displayData(jsonData);
            
            console.log("jsonData", jsonData);
            setAmount(jsonData.length)
        }
    }, [xlsx]);

    function displayData(data) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = "";

        const table = document.createElement("table");
        data.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        outputDiv.appendChild(table);
    }
    const back = () => {
        navigate("/tables");
    };


    function calculateDataForChart(table) {
        const dates = [];
        const counts = [];

        for (let i = 1; i < table.length; i++) {
            const dateStr = table[i][1].substring(0, 10); // Берем первые 10 символов строки даты
            if (!dates.includes(dateStr)) {
                dates.push(dateStr);
                counts.push(1);
            } else {
                const index = dates.indexOf(dateStr);
                counts[index]++;
            }
        }

        return [dates, counts];
    }

    const showStats = () => {
        let [dates, counts] = calculateDataForChart(tmp_table)


        let statsModal = document.querySelector(".stats-modal-overlay");
        statsModal.classList.remove("stats-modal-overlay_hidden");

        setChart({
            labels: dates,
            datasets: [{
                label: 'Количество ответов',
                backgroundColor: '#F8604A',
                borderColor: '#F8604A',
                data: counts,
            }]
        })
    };
    const closeModal = (event) => {
        let statsModal = event.target.closest(".stats-modal-overlay");
        statsModal.classList.add("stats-modal-overlay_hidden");
    };

    return (
        <div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
            <div>
                <div className="title"> 
                <h1>{name}</h1>
                <h3>Всего ответов на форму: {amount}</h3>
                </div>
                
                <div className="filter">
                    <div className="center">
                        <button className="search_button" onClick={back}>
                            <strong>Вернуться</strong>
                        </button>
                    </div>

                    <div className="center">
                        <select
                            id="filter"
                            name="select"
                            value={selectedOption}
                            onChange={handleChange}
                        >
                            <option value="default">Выберите тип</option>
                            <option value="new">Сначала новые ответы</option>
                            <option value="old">Сначала старые ответы</option>
                        </select>
                    </div>

                    <div className="center">
                        <input
                            type="text"
                            className="text-field__input"
                            placeholder="ID"
                            onChange={handleIdChange}
                        ></input>
                        <button type="submit" className="search_button " onClick={IDBut}>
                            <img src={searchIcon}></img>
                            <strong>Поиск </strong>
                        </button>
                    </div>

                    <div className="center">
                        <input
                            type="date"
                            name="before"
                            id="date-input__before"
                            className="text-field__input"
                            onChange={handleDateChange}
                        ></input>
                        <strong>-</strong>
                        <input
                            type="date"
                            name="after"
                            id="date-input__after"
                            className="text-field__input"
                            onChange={handleDateChange}
                        ></input>
                        <button type="submit" className="search_button" onClick={seacrhBut}>
                            <strong>Показать</strong>
                        </button>
                    </div>
                    <div className="center">
                        <button id="stats" className="search_button" onClick={showStats}>
                            <strong>Статистика</strong>
                        </button>
                    </div>
                </div>
            </div>
            <div id="output"></div>
            <div className="stats-modal-overlay stats-modal-overlay_hidden">
                <div className="stats-modal">
                    <h3 className="stats-modal__question">
                        Статистика формы <q>{name}</q>
                    </h3>

                    <div className="diagram">
                        <Bar data={chart_data} options={{
                            scales: {
                                y: {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    }
                                }
                            }
                        }} />
                    </div>

                    <div className="stats-modal__buttons">
                        <Button type="button" text="Закрыть" click={closeModal}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
