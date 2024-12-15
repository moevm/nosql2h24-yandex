import './Button.css'

export default function Button(props){
    return <button name={props.name} type={props.type} className='button' onClick={props.click}>{props.text}</button>
} 