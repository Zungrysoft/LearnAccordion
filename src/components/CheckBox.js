function CheckBox({ text, checked, onChange, textColor="black" }) {
    let rnum = Math.floor(Math.random() * 9007199254740991)
    return (
        <div className="align">
            <label
                for={"cbLabel_" + rnum}
                style={{
                    color: textColor
                }}
            >{text}</label>
            <input
                type="checkbox"
                checked={checked?true:false}
                className="checkbox"
                id={"cbLabel_" + rnum}
                onChange={(e) => {onChange(e.target.checked)}}
            />
        </div>
    )
}

export default CheckBox;
