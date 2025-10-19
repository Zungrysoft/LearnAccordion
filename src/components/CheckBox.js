function CheckBox({ text, checked, onChange, textColor = "black" }) {
    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
            <label style={{ cursor: "pointer", color: textColor, fontSize: '18px' }}>
                <div style={{ display: "flex", flexDirection: "row", padding: '16px', justifyContent: 'center', alignItems: 'center' }}>
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
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </label>
        </div>
    )
}

export default CheckBox;
