import React from "react";
import { useTheme } from "../helpers/theme";

export default function Tabs({ tabs = [], activeTab, setActiveTab, smallTabs }) {
  const { colorBackgroundDark, filterIcon, colorText, colorBackground } = useTheme();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
    },
    tabBar: {
      display: "flex",
      width: "100%",
      justifyContent: "center"
    },
    tab: (isActive) => ({
      flex: 1,
      textAlign: "center",
      padding: smallTabs ? '4px' : '12px',
      fontSize: "12px",
      fontWeight: "bold",
      cursor: isActive ? "auto" : "pointer",
      backgroundColor: isActive ? colorBackground : colorBackgroundDark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      border: '0px',
      margin: smallTabs ? '8px' : '0px',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabs.map(({ id, title, icon, style }) => (
          <button
            key={id + title}
            style={{
              ...styles.tab(activeTab === id),
              ...style,
            }}
            onClick={() => setActiveTab(id)}
          >
            {icon && (
              <img
                src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
                alt=""
                style={{ width: '32px', height: '32px', filter: filterIcon }}
              />
            )}
            {title && <h2 style={{ margin: '8px', color: colorText }}>{title}</h2>}
          </button>
        ))}
      </div>
    </div>
  );
}
