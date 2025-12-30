import React from "react";
import { useTheme } from "../helpers/theme";
import { NavLink } from "react-router-dom";

export default function NavTabs({ tabs = [], isVertical=false, requireExactUrlMatch=false }) {
  const { colorBackgroundDark, colorBackground, filterIcon, colorText } = useTheme();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
    },
    tabBar: {
      display: "flex",
      flexDirection: isVertical ? 'column' : 'row',
      width: "100%",
      justifyContent: "center",
    },
    tab: (isActive) => ({
      flex: 1,
      textAlign: 'center',
      textDecoration: 'none',
      padding: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      cursor: isActive ? "auto" : "pointer",
      backgroundColor: isActive ? colorBackground : colorBackgroundDark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: isVertical ? 'start' : 'center',
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
            })}
            end={requireExactUrlMatch}
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
