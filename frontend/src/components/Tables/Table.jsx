import TableHeader from "./TableHeader.jsx";
import Button from "./Button.jsx";


export default function Table(props) {
    return (
        <div className="container">
            <TableHeader title={props.name} />

            <div className="upper_buttons">
                <Button text="Таблица"></Button>
                <Button text="Форма"></Button>
            </div>
            <div className="low_buttons">
                <Button text="Статистика и история"></Button>
                <Button text="Настройки доступа"></Button>
            </div>
        </div>
    )
}