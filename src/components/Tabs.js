import React from "react";
import { useTheme } from "../helpers/theme";
import { NavLink } from "react-router-dom";

export default function Tabs({ tabs = [] }) {
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
      padding: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      cursor: isActive ? "auto" : "pointer",
      backgroundColor: isActive ? "inherit" : colorBackgroundDark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabs.map(({ title, icon, style, url }) => (
          <NavLink
            key={title + url}
            to={url ?? '/'}
            style={({ isActive }) => ({
              ...styles.tab(isActive),
              ...style,
              flex: 1,
              textDecoration: 'none',
            })}
          >
            {icon && (
              <img
                src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
                alt=""
                style={{ width: '32px', height: '32px', filter: filterIcon }}
              />
            )}
            {title && <h2 style={{ margin: '8px', color: colorText }}>{title}</h2>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
