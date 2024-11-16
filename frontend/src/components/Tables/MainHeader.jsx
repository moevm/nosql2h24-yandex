import "./MainHeader.css"
import searchIcon from "/search.svg";

export default function MainHeader() {
    return (
    <div className="main_header">
        <h1><span>Т</span>аблицы</h1>
        <input type="text" className="text-field__input" placeholder="Название таблицы"></input>
        <input type="text" className="text-field__input" placeholder="Владелец"></input>
        <input type="text" className="text-field__input" placeholder="Дата созданиия"></input>
        <input type="text" className="text-field__input" placeholder="Реадакторы"></input>

        
        <button className="search_button">
            <img src={searchIcon}></img>
            <strong>Поиск</strong>
            </button>

    </div>
    )
}