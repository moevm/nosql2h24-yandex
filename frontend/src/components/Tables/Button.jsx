import './Button.css'

export default function Button(props){
    return <button className='button' onClick={props.getTable}>{props.text}</button>
} 