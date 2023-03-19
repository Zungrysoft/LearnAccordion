function CheckBox({ text, checked, onChange }) {
    return (
        <div className="align">
            <h2>{text}</h2>
            <input type="checkbox" checked={checked?true:false} className="checkbox" onChange={(e) => {onChange(e.target.checked)}}></input>
        </div>
    )
}

export default CheckBox;
