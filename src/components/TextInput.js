function TextInput({ value, onChange, onClear, placeholder }) {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: "4px",
        padding: "4px 8px",
        height: "16px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          whiteSpace: "nowrap",
          fontSize: "14px",
          width: "120px",
        }}
      />
      <div style={{
        width: "24px"
      }}>
        {value && (
          <button
            onClick={onClear}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default TextInput;
