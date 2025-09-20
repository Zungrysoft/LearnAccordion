import { useTheme } from "../helpers/theme";

const SettingsGroup = ({ title, scale, children }) => {
  const { colorText } = useTheme();

  const headerItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: scale,
  }

  const containerStyle = {
    padding: '8px',
    border: `2px solid ${colorText}`,
    borderRadius: '10px',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    gap: '16px',
  }

  return (

    <div style={headerItemStyle}>
      <h2 style={{ color: colorText, margin: '8px' }}>{title}</h2>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  )
}

export default SettingsGroup;
