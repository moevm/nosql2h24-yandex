import Header from "./Header.jsx";
import MainHeader from "./MainHeader.jsx";
import { useState } from "react";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import React, { useRef } from "react";
import { setBrokers } from "../store/broker-slice.jsx";
import { setUsers } from "../store/user-slice.jsx";
import { setXlsx, setName } from "../store/xlsx-slice.jsx";
import "./modalCss.css";
import Button from "./Button.jsx";
import "./Table.css";
import close from "/close.svg";
import edit from "/edit.svg"
import "./dropMenu.css"
import addRedactor from "/addRedactor.svg"
import { getCurrentDate } from "./utils.jsx";
import { useEffect } from "react";
import { setLogs } from "../store/log-slice.jsx";

export default function Tables() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let mail = localStorage.getItem("mail");
  let serverInfo = useSelector((state) => state.broker.brokers);
  let forms = serverInfo.forms
  let allUsers = useSelector((state) => state.user.users);
  let size = localStorage.getItem("size");
  let searchValues = useSelector((state) => state.search.searchValues)

  const initialValuesForNewLink = {
    tableName: "",
    formName: "",
    redactors: [],
    ownerMail: `${mail}`,
  };
  const [newValues, setNewValues] = useState(initialValuesForNewLink);

  const closeModal = (event) => {
    if (event.target.closest(".delete-modal")) {
      let modalWindow = document.querySelector(".delete-modal-overlay");
      modalWindow.classList.add("delete-modal-overlay_hidden");
    }
    else if (event.target.closest(".redactors-modal")) {
      let modalWindow = document.querySelector(".redactors-modal-overlay");
      modalWindow.classList.add("redactors-modal-overlay_hidden");
    }
    else if (event.target.closest(".edit-modal")) {
      let modalWindow = document.querySelector(".edit-modal-overlay");
      modalWindow.classList.add("edit-modal-overlay_hidden");

      let editInfo = modalWindow.querySelectorAll(".text-field__input")
      editInfo.forEach((input) => {
        input.value = ''
      })
    }
    else {
      let modalWindow = document.querySelector(".add-modal-overlay");
      modalWindow.classList.add("add-modal-overlay_hidden");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewValues({ ...newValues, [name]: value });
  };
  const sendNewLink = async (event) => {
    event.preventDefault();
    let modalWindow = document.querySelector(".add-modal-overlay");
    let errorSpan = modalWindow.querySelector(".add-error-msg")

    try {
      await axios.post("http://localhost:8080/forms/create-form", newValues);
      const res = await axios.get(`http://localhost:8080/forms/${mail}?page=${serverInfo.page}&size=${size}`);
      dispatch(setBrokers(res.data));
      modalWindow.classList.add("add-modal-overlay_hidden");
      errorSpan.innerText = ""
    } catch (error) {
      errorSpan.innerText = `${error.response.data}`
    }

  };
  const handleSubmit = () => {
    let modalWindow = document.querySelector(".add-modal-overlay");
    modalWindow.classList.remove("add-modal-overlay_hidden");
    let addErrorSpan = modalWindow.querySelector(".add-error-msg")
    addErrorSpan.innerText = ""

    setNewValues({ ...newValues, "redactors": [] });
  };

  const exportData = () => {
    axios.get("http://localhost:8080/forms/export").then((response) => {
      const link = document.createElement("a");
      link.setAttribute("download", "data.json");
      const blob = new Blob([JSON.stringify(response.data)], {
        type: "application/json",
      });
      link.href = URL.createObjectURL(blob);

      link.click();
    });
  };
  const fileInputRef = useRef(null);
  const importData = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("jsonFile", selectedFile);
      try {
        await axios
          .post("http://localhost:8080/forms/import", formData)
          .then((response) => {
            console.log("Импорт завершен успешно!", response);
          });

        const res = await axios.get(`http://localhost:8080/forms/${mail}?page=${0}&size=${size}`);
        console.log("res data - ", res.data);
        dispatch(setBrokers(res.data));
      } catch (error) {
        console.error("Ошибка при обработке форм: ", error);
      }
    }
  };

  let activeForm = null;
  const deleteForm = async () => {

    if (activeForm) {
      let check = (forms.length - 1) % 3 === 0 && serverInfo.page !== 0 ? 1 : 0
      await axios.delete(`http://localhost:8080/forms/${activeForm.id}`);
      const res = await axios.get(`http://localhost:8080/forms/${mail}?page=${serverInfo.page - check}&size=${size}`);
      dispatch(setBrokers(res.data));
      let redactorsModalWindow = document.querySelector(".delete-modal-overlay")
      redactorsModalWindow.classList.add("delete-modal-overlay_hidden");
    }
  };

  const clicklOnTbody = async (event) => {
    let showbut = event.target.closest(".dropbtn")
    let deleteImg = event.target.closest(".deleteImg")
    let tableBut = event.target.closest(".button")
    let editImg = event.target.closest(".editImg")
    let currentForm = event.target.closest("tr")
    activeForm = JSON.parse(currentForm.dataset.form);

    let editErrorSpan = document.querySelector(".edit-error-msg")

    if (showbut) {
      let saveBut = document.querySelector('[name="saveBut"]')
      console.log("saveBut in tbody - ", saveBut);
      if (saveBut.dataset.create) {
        saveBut.removeAttribute("data-create")
      }

      let redactors = activeForm.redactors
      let allCheckBoxes = document.querySelectorAll('[type="checkbox"]')

      allCheckBoxes.forEach((input) => {
        input.checked = false;

        if (redactors.includes(input.name)) {
          input.checked = true;
        }
      });

      // const updatedAllUsers = Object.fromEntries(
      //   Object.keys(allUsers).map(key => [key, false])
      // );
      // redactors.forEach(email => {
      //   updatedAllUsers[email] = true;
      // });
      // dispatch(setUsers(updatedAllUsers));

      let redactorsModalWindow = document.querySelector(".redactors-modal-overlay")
      redactorsModalWindow.classList.remove("redactors-modal-overlay_hidden");
    }
    if (deleteImg) {
      let deleteModalWindow = document.querySelector(".delete-modal-overlay");
      deleteModalWindow.classList.remove("delete-modal-overlay_hidden");
    }
    if (tableBut) {
      let { id, tableName } = activeForm;
      try {
        const response = await fetch(`http://localhost:8080/forms/table/${id}`);
        const arrayBuffer = await response.arrayBuffer();
        let data = new Uint8Array(arrayBuffer);
        dispatch(setXlsx(data));
        dispatch(setName(tableName));
        navigate('/xlsx/' + id)
      } catch (error) {
        console.error("Ошибка", error);
      }
    }
    if (editImg) {
      editErrorSpan.innerText = ""
      let editModalWindow = document.querySelector(".edit-modal-overlay");
      editModalWindow.classList.remove("edit-modal-overlay_hidden");
    }

  };
  const showAllUsers = () => {
    let redactorsModalWindow = document.querySelector(".redactors-modal-overlay")

    // const updatedAllUsers = Object.fromEntries(
    //   Object.keys(allUsers).map(key => [key, false])
    // );
    // dispatch(setUsers(updatedAllUsers));

    let allCheckBoxes = redactorsModalWindow.querySelectorAll('[type="checkbox"]')
    allCheckBoxes.forEach((input) => {
      input.checked = false;
    });


    redactorsModalWindow.classList.remove("redactors-modal-overlay_hidden");
    let saveBut = redactorsModalWindow.querySelector('[name="saveBut"]')
    saveBut.setAttribute("data-create", "true")
  }
  const editForm = async (event) => {
    event.preventDefault()

    if (activeForm) {
      let editModalWindow = document.querySelector(".edit-modal-overlay");
      let errorSpan = editModalWindow.querySelector(".edit-error-msg")

      let editInfo = editModalWindow.querySelectorAll(".text-field__input")
      console.log(editInfo);
      const values = Array.from(editInfo).map(input => input.value);

      const formData = Object.fromEntries(values.map((value, index) => [`${index === 0 ? 'formName' : 'tableName'}`, value]));
      formData["formId"] = activeForm.id

      try {

        await axios.patch(`http://localhost:8080/forms/update`, formData);
        const res = await axios.get(`http://localhost:8080/forms/${mail}?page=${serverInfo.page}&size=${size}`);
        dispatch(setBrokers(res.data));
        editInfo.forEach((input) => {
          input.value = ''
        })
        editModalWindow.classList.add("edit-modal-overlay_hidden");
      }
      catch (error) {
        errorSpan.innerText = `${error.response.data}`
      }
    }
  }

  const saveRedactors = async (event) => {
    event.preventDefault()
    let saveBut = event.target
    let redactorsModalWindow = event.target.closest(".redactors-modal-overlay")
    let allCheckBoxes = redactorsModalWindow.querySelectorAll('[type="checkbox"]')
    const filteredCheckBoxes = Array.from(allCheckBoxes).filter(input => input.checked);
    const namesNewRedactors = filteredCheckBoxes.map(input => input.name);
    console.log("namesNewRedactors", namesNewRedactors);

    if (saveBut.dataset.create) {
      setNewValues({ ...newValues, "redactors": namesNewRedactors });
    }
    else {
      if (activeForm) {
        await axios.patch(`http://localhost:8080/forms/redactors`, { redactors: namesNewRedactors, formId: activeForm.id });
        const res = await axios.get(`http://localhost:8080/forms/${mail}?page=${serverInfo.page}&size=${size}`);
        dispatch(setBrokers(res.data));
      }
    }

    redactorsModalWindow.classList.add("redactors-modal-overlay_hidden");
  }

  const changeText1 = (event) => {
    event.target.innerText = "Изменить"
    event.target.style.color = "white"
  }
  const changeText2 = (event) => {
    event.target.innerText = "Показать"
    event.target.style.color = "black"
  }

  function hasAllEmptyProperties(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (obj[key] !== '') {
        return false;
      }
    }
    return true;
  }

  const switchPage = async (event) => {
    let paginationButton = event.target
    if (paginationButton.name === "forward") {
      if (hasAllEmptyProperties(searchValues)) {
        let page = serverInfo.page !== serverInfo.totalPage - 1 ? serverInfo.page + 1 : serverInfo.page

        const url = `http://localhost:8080/forms/${mail}?page=${page}&size=${size}`;

        const res = await axios.get(url);
        dispatch(setBrokers(res.data));
      }
      else {
        let url = new URL(`http://localhost:8080/forms/table`);
        let page = serverInfo.page !== serverInfo.totalPage - 1 ? serverInfo.page + 1 : serverInfo.page

        const params = new URLSearchParams({ ...searchValues, page: page, size: size });
        console.log(params);
        url.search = params.toString();

        try {
          const response = await fetch(url.href, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          console.log('Ответ от сервера:', data);
          dispatch(setBrokers(data));

        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error);
        }
      }

    }
    else if (paginationButton.name === "back") {
      if (serverInfo.page != 0) {
        if (hasAllEmptyProperties(searchValues)) {
          let page = serverInfo.page - 1

          const url = `http://localhost:8080/forms/${mail}?page=${page}&size=${size}`;

          const res = await axios.get(url);
          dispatch(setBrokers(res.data));
        }
        else {
          let url = new URL(`http://localhost:8080/forms/table`);
          let page = serverInfo.page - 1

          const params = new URLSearchParams({ ...searchValues, page: page, size: size });
          url.search = params.toString();

          try {
            const response = await fetch(url.href, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            dispatch(setBrokers(data));

          } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
          }
        }
      }

    }
  }
  const toHistory = () => {
    axios.get(`http://localhost:8080/logs`).then((res) => {
      console.log(res.data);
      dispatch(setLogs(res.data.logs))
    })
    navigate("/logs")
  }

  return (
    <div>
      <Header />
      <main>
        <MainHeader></MainHeader>

        <div className="add_transfer">
          <button className="search_button" onClick={handleSubmit}>
            <strong>Добавить связь</strong>
          </button>
          <button className="search_button" onClick={importData}>
            <strong>Импорт</strong>
          </button>
          <button className="search_button" onClick={exportData}>
            <strong >Экспорт</strong>
          </button>
          <button className="search_button" onClick={toHistory}><strong>История</strong></button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
        />

        <div>
          <table className="table-fill">
            <thead>
              <tr>
                <th className="text-left">
                  <strong>Название формы</strong>
                </th>
                <th className="text-left">
                  <strong>Владелец</strong>
                </th>
                <th className="text-left">
                  <strong>Дата создания</strong>
                </th>
                <th className="text-left">
                  <strong>Редакторы</strong>
                </th>
                <th className="text-left">
                  <strong>Таблица</strong>
                </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody onClick={clicklOnTbody}>
              {forms.map((form, ind) => (
                <tr key={ind} data-form={JSON.stringify(form)}>
                  <td>{form.name}</td>
                  <td>{form.ownerEmail}</td>
                  <td>{form.date}</td>
                  <td>{
                    <div >
                      <div className="dropdown">
                        <button className="dropbtn" onMouseOver={changeText1} onMouseLeave={changeText2}>Показать</button>
                        <div className="dropdown-content">
                          {form.redactors.map((redactor, ind) => (
                            <a key={ind}>{redactor}</a>
                          ))}
                        </div>
                      </div>
                      {/* <a id="addRedactor" className="addRedactor">
                        <img src={addRedactor} ></img>
                      </a> */}
                    </div>
                  }
                  </td>
                  <td>
                    <Button text={form.tableName} ></Button>
                  </td>
                  <td className="text-center">
                    {
                      <a>
                        <img src={edit} className="editImg"></img>
                      </a>
                    }
                  </td>
                  <td className="text-center">
                    {
                      <a>
                        <img src={close} className="deleteImg" ></img>
                      </a>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <Button name="back" text="<<<" click={switchPage}></Button>
          <span><strong>{serverInfo.page + 1}</strong></span>
          <Button name="forward" text=">>>" click={switchPage}></Button>
        </div>
      </main>
      <div className="add-modal-overlay add-modal-overlay_hidden">
        <div className="add-modal">
          <form onSubmit={sendNewLink}>
            <h3 className="add-modal__question">
              Введите данные для создания связи
            </h3>
            <div className="inputs">
              <input
                name="formName"
                className="text-field__input"
                onChange={handleChange}
                placeholder="Название связи (формы)"
              ></input>
              <input
                name="tableName"
                className="text-field__input"
                onChange={handleChange}
                placeholder="Название таблицы"
              ></input>
              <button type="button" className="button addRedactor" onClick={showAllUsers}>Настроить редакторов</button>

              {/* <input
                name="redactors"
                className="text-field__input"
                onChange={handleChange}
                placeholder="Редактор, редактор"
              ></input> */}
            </div>
            <div className="add-modal__buttons">
              <Button type="button" text="Отмена" click={closeModal}></Button>
              <Button type="submit" text="Добавить связь"></Button>
            </div>
            <span className="add-error-msg"></span>
          </form>
        </div>
      </div>

      <div className="delete-modal-overlay delete-modal-overlay_hidden">
        <div className="delete-modal">
          <h3 className="delete-modal__question">
            Вы действительно хотите удалить эту связь?
          </h3>
          <div className="delete-modal__buttons">
            <Button type="button" text="Отмена" click={closeModal}></Button>
            <Button text="Удалить" click={deleteForm}></Button>
          </div>
        </div>
      </div>

      <div className="edit-modal-overlay edit-modal-overlay_hidden">
        <div className="edit-modal">
          <h3 className="edit-modal__question">
            Изменение данных
          </h3>
          <form onSubmit={editForm}>
            <div className="inputs">
              <input className="text-field__input" placeholder="Новое название формы" ></input>
              <input className="text-field__input" placeholder="Новое название таблицы"></input>
              {/* <input name="redactors" className="text-field__input" placeholder="Новые, редакторы" ></input> */}
            </div>
            <div className="edit-modal__buttons">
              <Button type="button" text="Отмена" click={closeModal}></Button>
              <Button type="submit" text="Сохранить" ></Button>
            </div>
            <span className="edit-error-msg"></span>
          </form>

        </div>
      </div>

      <div className="redactors-modal-overlay redactors-modal-overlay_hidden">
        <div className="redactors-modal">
          <h3 className="redactors-modal__question">
            Настрока прав редактирования
          </h3>
          <div className="test">
            <table className="table-fill__redactors">
              <thead>
                <tr>
                  <th className="myTh"></th>
                  <th>Редакторы</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, ind) => (
                  <tr key={ind}>
                    <td className="text-center">
                      <input name={user.email} className="checkbox" type="checkbox" />
                    </td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form type="submit">
            <div className="redactors-modal__buttons">
              <Button type="button" text="Отмена" click={closeModal}></Button>
              <button type="submit" name="saveBut" onClick={saveRedactors}>Сохранить</button>
              {/* <Button type="submit" text="Сохранить" click={saveRedactors} name="saveBut"></Button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
