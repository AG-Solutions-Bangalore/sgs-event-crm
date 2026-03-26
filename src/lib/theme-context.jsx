import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, App } from "antd";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  useEffect(() => {
    const root = document.documentElement;
  
   
    root.classList.remove(
      "theme-yellow",
      "theme-green",
      "theme-purple",
      "theme-teal",
      "theme-gray"
    );
  

    if (theme === "yellow") {
      root.classList.add("theme-yellow");
    } else if (theme === "green") {
      root.classList.add("theme-green");
    } else if (theme === "purple") {
      root.classList.add("theme-purple");
    } else if (theme === "teal") {
      root.classList.add("theme-teal");
    } else if (theme === "gray") {
      root.classList.add("theme-gray");
    }
  
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  const themeColors = {
    default: "#ea580c",
    yellow: "#eab308",
    green: "#16a34a",
    purple: "#7c3aed",
    teal: "#0d9488",
    gray: "#94a3b8",
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: themeColors[theme] || themeColors.default,
            borderRadius: 8,
          },
        }}
      >
        <App>
          {children}
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
