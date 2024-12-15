import './TablesXlsx.css'
import { useEffect } from "react";
import * as XLSX from 'xlsx';
import { useSelector } from "react-redux";
import "./select.css"
import { useState } from "react";
import searchIcon from "/search.svg";

export function TablesXlsx() {
    let xlsx = useSelector((state) => state.xlsx.bytes);
    let name = useSelector((state) => state.xlsx.name);

    const [table, setTable] = useState('');
    const [selectedOption, setSelectedOption] = useState('default'); // Начальное состояние
    const handleChange = (event) => {
        setSelectedOption(event.target.value);

        switch (event.target.value) {
            case 'new':
                console.log('Сначала новые ответы');
                displayData(sortByCreationTimeDescending(table))
                break;
            case 'old':
                displayData(sortByCreationTimeAscending(table))
                console.log('Сначала старые ответы');
                break;
            case 'all':
                sortByCreationTimeDescending(table)
                sortByCreationTimeAscending(table)
                displayData(filterByDateRange(table, new Date("2024-11-11"), new Date("2024-11-25")))

                break;
            default:
                console.log('Выберите тип');
                break;
        }
    };

    function parseDate(dateString) {
        return new Date(dateString);
    }
    // Фильтрация строк таблицы по диапазону дат
    function filterByDateRange(table, startDate, endDate) {
        let headerRow = table.shift(); // Убираем заголовок таблицы
        let filteredRows = table.filter(row => {
            let rowDate = parseDate(row[1]);
            return rowDate >= startDate && rowDate <= endDate;
        });
        filteredRows.unshift(headerRow); // Возвращаем заголовок обратно
        return filteredRows;
    }
    // Сортировка строк таблицы по времени создания (по возрастанию)
    function sortByCreationTimeAscending(table) {
        let headerRow = table.shift(); // Убираем заголовок таблицы
        let sortedRows = table.sort((a, b) => {
            let dateA = parseDate(a[1]);
            let dateB = parseDate(b[1]);
            if (dateA > dateB) return 1;
            else if (dateA < dateB) return -1;
            else return 0;
        });
        table.unshift(headerRow); // Возвращаем заголовок обратно
        return table;
    }
    // Сортировка строк таблицы по времени создания (по убыванию)
    function sortByCreationTimeDescending(table) {
        let headerRow = table.shift(); // Убираем заголовок таблицы
        let sortedRows = table.sort((a, b) => {
            let dateA = parseDate(a[1]);
            let dateB = parseDate(b[1]);
            if (dateA > dateB) return -1;
            else if (dateA < dateB) return 1;
            else return 0;
        });
        table.unshift(headerRow); // Возвращаем заголовок обратно
        return table;
    }

    useEffect(() => {
        if (xlsx) {
            const workbook = XLSX.read(xlsx, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            setTable(jsonData);
            displayData(jsonData);
            console.log("jsonData", jsonData);
        }
    }, [xlsx]);

    function displayData(data) {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';

        const table = document.createElement('table');
        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        outputDiv.appendChild(table);
    }

    return (
        <div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
            <div>
                <h1>{name}</h1>
                <div className='filter'>
                    <select id="filter" name="select" value={selectedOption} onChange={handleChange}>
                        <option value="default">Выберите тип</option>
                        <option value="new">Сначала новые ответы</option>
                        <option value="old">Сначала старые ответы</option>
                        <option value="all">Вывести все</option>
                    </select>
                    <div className='center'>
                        <input type="text" className="text-field__input ID" placeholder="ID" ></input>
                        <input type="date" id="date-input__before" data-name="before" className="text-field__input" placeholder="С" ></input>
                        <strong>-</strong>
                        <input type="date" id="date-input__after" data-name="after" className="text-field__input" placeholder="По" ></input>
                        <button type="submit" className="search_button ID">
                            <img src={searchIcon}></img>
                            <strong>Поиск</strong>
                        </button>
                    </div>
                </div>
            </div>
            <div id="output"></div>
        </div>
    );
}
