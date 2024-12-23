import Header from "../Tables/Header.jsx";
import MainHeader from "../Tables/MainHeader.jsx";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import "../Tables/modalCss.css";
import Button from "../Tables/Button.jsx";
import "../Tables/Table.css";
import close from "/close.svg";
import edit from "/edit.svg"
import "../Tables/dropMenu.css"
import LogsHeader from "./LogsHeader.jsx";
import { useEffect } from "react";
import { setLogs } from "../store/log-slice.jsx";

export default function Logs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let serverInfo = useSelector((state) => state.broker.brokers);
  let forms = serverInfo.forms
  let data = useSelector((state) => state.log.logs);
  let logs = data.logs
  let mail = localStorage.getItem("mail");
  let logSearchValues = useSelector((state) => state.logSearch.logSearchValues)

  function hasAllEmptyProperties(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (obj[key] !== '') {
        return false;
      }
    }
    return true;
  }

  const clicklOnTbody = () => {
    console.log("object");
  }
  const back = () => {
    navigate("/tables")
  }

  const switchPage = async (event) => {
    let paginationButton = event.target

    if (paginationButton.name === "forward") {
      if (hasAllEmptyProperties(logSearchValues)) {
        let page = data.page !== data.totalPage - 1 ? data.page + 1 : data.page
        if(data.totalPage === 0) page = 0

        const url = `http://localhost:8080/logs?page=${page}&size=${5}`;

        const res = await axios.get(url);
        dispatch(setLogs(res.data));
      }
      else {
        let page = data.page !== data.totalPage - 1 ? data.page + 1 : data.page
        if(data.totalPage === 0) page = 0

        let url = new URL('http://localhost:8080/logs/search');
        const params = new URLSearchParams({ ...logSearchValues, size: data.size, page: page });
        url.search = params.toString();
        try {
          const response = await fetch(url.href, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          dispatch(setLogs(data));

        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error);
        }

      }


    }
    else if (paginationButton.name === "back") {
      if (data.page != 0) {
        if (hasAllEmptyProperties(logSearchValues)) {
          let page = data.page - 1
          const url = `http://localhost:8080/logs?page=${page}&size=${data.size}`;
          const res = await axios.get(url);
          dispatch(setLogs(res.data));
        }
        else {
          let page = data.page - 1
          let url = new URL('http://localhost:8080/logs/search');
          const params = new URLSearchParams({ ...logSearchValues, size: data.size, page: page });
          url.search = params.toString();
          try {
            const response = await fetch(url.href, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            dispatch(setLogs(data));

          } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
          }
        }
      }
    }
  }

  return (
    <div>
      <Header />
      <main>
        <LogsHeader></LogsHeader>
        <div className="add_transfer">
          <button className="search_button" onClick={back}>
            <strong>Вернуться</strong>
          </button>
        </div>

        <div>
          <table className="table-fill">
            <thead>
              <tr>
                <th className="text-left">
                  <strong>ID формы</strong>
                </th>
                <th className="text-left">
                  <strong>Тип события</strong>
                </th>
                <th className="text-left">
                  <strong>Кто</strong>
                </th>
                <th className="text-left">
                  <strong>Когда</strong>
                </th>
                <th className="text-left">
                  <strong>Действие</strong>
                </th>
              </tr>
            </thead>
            <tbody onClick={clicklOnTbody}>
              {logs.map((log, ind) => (
                <tr key={ind}>
                  <td>{log.formId}</td>
                  <td>{log.eventType}</td>
                  <td>{log.editEmail}</td>
                  <td>{log.editTime}</td>
                  <td>{log.editAction}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <Button name="back" text="<<<" click={switchPage}></Button>
          <span><strong>{data.page + 1}</strong></span>
          <Button name="forward" text=">>>" click={switchPage}></Button>
        </div>
      </main>
    </div>
  );
}
