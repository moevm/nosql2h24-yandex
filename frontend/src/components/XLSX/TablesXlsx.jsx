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
    let initialDates = {
        "before": "",
        "after": ""
    }
    const [selectedDate, setSelectedDate] = useState(initialDates);
    const [table, setTable] = useState('');
    const [ID, setID] = useState('');
    const [selectedOption, setSelectedOption] = useState('default');

    const handleIdChange = (event) => {
        setID(event.target.value)
    }
    const handleDateChange = (event) => {
        setSelectedDate({ ...selectedDate, [event.target.name]: event.target.value });
    };
    const handleChange = (event) => {
        setSelectedOption(event.target.value);

        switch (event.target.value) {
            case 'new':
                displayData(sortByCreationTimeDescending(table))
                break;
            case 'old':
                displayData(sortByCreationTimeAscending(table))
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
        startDate = new Date(startDate !== "" ? startDate + " 00:00:00" : "2000-01-01")
        endDate = new Date(endDate !== "" ? endDate + " 23:59:59": "3000-01-01")

        if (table.length > 1) {
            let headerRow = table.shift(); // Убираем заголовок таблицы
            let filteredRows = table.filter(row => {
                let rowDate = parseDate(row[1]);
                return rowDate >= startDate && rowDate <= endDate;
            });
            filteredRows.unshift(headerRow); // Возвращаем заголовок обратно
            table.unshift(headerRow); // Возвращаем заголовок обратно

            return filteredRows;
        }
        
        console.log("Filter_table = ", table);
        return table
        
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
        return table
        
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

    const IDBut = (event) => {
        console.log("table", table);
        if(ID !== ""){
            let headerRow = table.shift();
            let answer = table.filter(row => {
                return ID === row[0];
            });
            answer.unshift(headerRow); 
            table.unshift(headerRow);
            displayData(answer);
        }
        else{
            displayData(table)
        }
    }

    const seacrhBut = () => {
        let newT = sortByCreationTimeAscending(table)
        displayData(filterByDateRange(newT, selectedDate.before, selectedDate.after))
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
                <div className='filter center'>
                    <select id="filter" name="select" value={selectedOption} onChange={handleChange}>
                        <option value="default">Выберите тип</option>
                        <option value="new">Сначала новые ответы</option>
                        <option value="old">Сначала старые ответы</option>
                    </select>
                    <div className='center'>
                        <input type="text" className="text-field__input ID" placeholder="ID" onChange={handleIdChange}></input>
                        <button type="submit" className="search_button ID" onClick={IDBut}>
                        <img src={searchIcon}></img>    
                            <strong>Поиск </strong>
                        </button>
                        <input type="date" name="before" id="date-input__before" className="text-field__input" onChange={handleDateChange}></input>
                        <strong>-</strong>
                        <input type="date" name="after" id="date-input__after" className="text-field__input" onChange={handleDateChange} ></input>
                            <button type="submit" className="search_button ID" onClick={seacrhBut}>
                                <strong>Показать</strong>
                            </button>
                    </div>
                </div>
            </div>
            <div id="output"></div>
        </div>
    );
}
