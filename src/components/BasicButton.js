import { useTheme } from "../helpers/theme";

function BasicButton({ text, icon, onClick, backgroundColor, width, height, disabled, unclickable, border }) {
  const { colorText, filterIcon } = useTheme();

  const buttonStyle = {
    flex: 1,
    width: width,
    maxWidth: width,
    minWidth: width,
    height: height ?? '48px',
    maxHeight:  height ?? '48px',
    minHeight:  height ?? '48px',
    backgroundColor: backgroundColor ?? 'inherit',
    border: border ? `2px solid ${colorText}` : 0,
    borderRadius: border ? '10px' : undefined,
    opacity: disabled ? '30%' : '100%',
    
    cursor: disabled || unclickable ? undefined : 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={disabled || unclickable ? () => {} : onClick}>
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
