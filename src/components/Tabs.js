import React from "react";

export default function Tabs({ tabHeaders = [], activeTab, onTabChange }) {
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
      padding: "20px",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: isActive ? "auto" : "pointer",
      backgroundColor: isActive ? "#757f92ff" : "inherit",
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabHeaders.map((header) => (
          <div
            key={header}
            style={styles.tab(activeTab === header)}
            onClick={() => onTabChange(header)}
          >
            <h2 style={{ margin: '0px', color: "white" }}>{header}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
