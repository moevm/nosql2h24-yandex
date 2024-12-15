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

export default function Tables() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let mail = localStorage.getItem("mail");
  let forms = useSelector((state) => state.broker.brokers);
  let allUsers = useSelector((state) => state.user.users);

  const initialValuesForNewLink = {
    table_name: "",
    form_name: "",
    redactors: "",
    creation_date: getCurrentDate("-"),
    owner_mail: `${mail}`,
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
    let modalWindow = document.querySelector(".add-modal-overlay");
    event.preventDefault();
    console.log("new - ", newValues);
    try {
      await axios.post("http://localhost:8080/forms/create-form", {
        ownerMail: mail,
        name: newValues.table_name,
      });

      const res = await axios.get(`http://localhost:8080/forms/${mail}`);
      dispatch(setBrokers(res.data));
    } catch (error) {
      console.error("Ошибка при обработке форм: ", error);
    }
    modalWindow.classList.add("add-modal-overlay_hidden");
  };
  const handleSubmit = () => {
    let modalWindow = document.querySelector(".add-modal-overlay");
    modalWindow.classList.remove("add-modal-overlay_hidden");
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
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    console.log("asdasd");
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

        const res = await axios.get(`http://localhost:8080/forms/${mail}`);
        dispatch(setBrokers(res.data));
      } catch (error) {
        console.error("Ошибка при обработке форм: ", error);
      }
    }
  };

  let activeForm = null;
  const deleteForm = async () => {
    if (activeForm) {
      console.log("удаляем activeForm и загружаем оставшиеся", activeForm);
      console.log("activeForm.id", activeForm.id);
      await axios.delete(`http://localhost:8080/forms/${activeForm.id}`);
      const res = await axios.get(`http://localhost:8080/forms/${mail}`);
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
    console.log("saveBut", saveBut);
  }
  const editForm = async (event) => {
    event.preventDefault()

    if (activeForm) {
      let editInfo = event.target.querySelectorAll(".text-field__input")
      const values = Array.from(editInfo).map(input => input.value);

      const formData = Object.fromEntries(values.map((value, index) => [`${index === 0 ? 'formName' : 'tableName'}`, value]));
      formData["formId"] = activeForm.id

      await axios.patch(`http://localhost:8080/forms/update`, formData);
      const res = await axios.get(`http://localhost:8080/forms/${mail}`);
      dispatch(setBrokers(res.data));
      console.log("new ---", res.data);
      editInfo.forEach((input) => {
        input.value = ''
      })

      let editModalWindow = document.querySelector(".edit-modal-overlay");
      editModalWindow.classList.add("edit-modal-overlay_hidden");
    }
  }

  const saveRedactors = async (event) => {
    event.preventDefault()
    let saveBut = event.target
    let redactorsModalWindow = event.target.closest(".redactors-modal-overlay")
    let allCheckBoxes = redactorsModalWindow.querySelectorAll('[type="checkbox"]')
    const filteredCheckBoxes = Array.from(allCheckBoxes).filter(input => input.checked);
    const namesNewRedactors = filteredCheckBoxes.map(input => input.name);


    if (saveBut.dataset.create) {
      console.log("[В кнопке создания] newRedactors - ", namesNewRedactors);
      console.log("[В кнопке создания] ждем остальных данных и отправялем");
      setNewValues({ ...newValues, "redactors": namesNewRedactors });
    }
    else {
      if (activeForm) {
        await axios.patch(`http://localhost:8080/forms/redactors`, { redactors: namesNewRedactors, formId: activeForm.id });
        const res = await axios.get(`http://localhost:8080/forms/${mail}`);
        dispatch(setBrokers(res.data));
      }

      console.log("[В таблице] newRedactors - ", namesNewRedactors);
      console.log("[В таблице] отправляем косте запрос и получаем новый forms");
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
            <strong>Экспорт</strong>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </div>

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
      </main>
      <div className="add-modal-overlay add-modal-overlay_hidden">
        <div className="add-modal">
          <form onSubmit={sendNewLink}>
            <h3 className="add-modal__question">
              Введите данные для создания связи
            </h3>
            <div className="inputs">
              <input
                name="table_name"
                className="text-field__input"
                onChange={handleChange}
                placeholder="Название таблицы"
              ></input>
              <input
                name="form_name"
                className="text-field__input"
                onChange={handleChange}
                placeholder="Название связи (формы)"
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
