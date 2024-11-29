"use client";

import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: string) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);