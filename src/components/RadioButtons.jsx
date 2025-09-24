import { useTheme } from "../helpers/theme";

const RadioButtons = ({ options, selectedOption, onChange, isCheckbox }) => {
  const { colorText } = useTheme();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'start', gap: "0px", padding: '0px' }}>
      {options.map((option) => (
        <label key={option.value} style={{ cursor: "pointer", color: colorText, margin: 0, padding: 0, fontSize: '18px' }}>
          <input
            type={isCheckbox ? "checkbox" : "radio"}
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
