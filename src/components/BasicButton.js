import { useTheme } from "../helpers/theme";

function BasicButton({ text, icon, onClick, backgroundColor, width, height }) {
  const { colorText, filterIcon } = useTheme();

  const buttonStyle = {
    flex: 1,
    width: width,
    maxWidth: width,
    backgroundColor: backgroundColor ?? 'inherit',
    border: 0,
    minWidth: '0px',
    height: height ?? '48px',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {text && (
          <h2 style={{ color: colorText, margin: '0px' }}>{text}</h2>
        )}
        {icon && (
          <img
            src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
            alt=""
            style={{
              width: '20px',
              height: '20px',
              filter: filterIcon,
            }}
          />
        )}
      </div>
    </button>
  )
}

export default BasicButton;
