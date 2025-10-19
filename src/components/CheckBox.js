function CheckBox({ text, checked, onChange, textColor = "black" }) {
    return (
        <label style={{ cursor: "pointer", color: textColor, fontSize: '18px' }}>
            <div style={{ display: "flex", flexDirection: "row", padding: '16px', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                {text}
                <input
                    type="checkbox"
                    checked={!!checked}
                    onChange={(e) => {onChange(e.target.checked)}}
                    style={{
                        color: 'white',
                        margin: '4px',
                        padding: 0,
                        width: '30px',
                        height: '30px',
                    }}
                />
            </div>
        </label>
    )
}

export default CheckBox;
