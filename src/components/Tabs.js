import React from "react";
import { useTheme } from "../helpers/theme";

export default function Tabs({ tabs = [], activeTab, onTabChange }) {
  const { colorBackgroundDark, filterIcon, colorText } = useTheme();

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
      justifyContent: "center",
    },
    tab: (isActive) => ({
      flex: 1,
      textAlign: "center",
      alignContent: "center",
      justifyItems: "center",
      padding: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      cursor: isActive ? "auto" : "pointer",
      backgroundColor: isActive ? "inherit" : colorBackgroundDark,
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabs.map(({ title, icon, value, style }) => (
          <div
            key={value}
            style={{...styles.tab(activeTab === value), ...style}}
            onClick={() => onTabChange(value)}
          >
            {icon && (
              <img
                src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
                alt=""
                style={{
                  width: '32px',
                  height: '32px',
                  margin: '0px',
                  filter: filterIcon,
                }}
              />
            )}
            {title && (
              <h2 style={{ margin: '8px', color: colorText }}>{title}</h2>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
