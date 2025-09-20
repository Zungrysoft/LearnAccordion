const RadioButtons = ({ options, selectedOption, onChange }) => {
  const handleChange = (event) => {
      onChange(event.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'start', gap: "0px", padding: '0px' }}>
      {options.map((option) => (
        <label key={option.value} style={{ cursor: "pointer", color: 'white', margin: 0, padding: 0, fontSize: '18px' }}>
          <input
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleChange}
            style={{ color: 'white', margin: '4px', padding: 0 }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtons;
