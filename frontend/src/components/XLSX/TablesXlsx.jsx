import './TablesXlsx.css'
import { useEffect } from "react";
import * as XLSX from 'xlsx';
import {useSelector} from "react-redux";

export function TablesXlsx() {
    let xlsx = useSelector((state) => state.xlsx.bytes);
    let name = useSelector((state) => state.xlsx.name);
    

    useEffect(() => {
        if (xlsx) {
            const workbook = XLSX.read(xlsx, { type: 'array' });
            console.log("workbook", workbook);
            const firstSheetName = workbook.SheetNames[0];
            console.log("object - ", workbook);
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            displayData(jsonData);
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
            <h1>{name}</h1>
            <div id="output"></div>
        </div>
    );
}
