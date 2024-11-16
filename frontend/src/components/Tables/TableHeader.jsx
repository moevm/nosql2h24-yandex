import close from "/close.svg"
import "./TableHeader.css"

export default function TableHeader(props){
    return (
        <div className="table_header">
            <h4 >{props.title}</h4>
            <img className="right_header" src={close}></img>
        </div>
    )
}