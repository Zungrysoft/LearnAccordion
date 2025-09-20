import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import themeData from '../data/themes.json';

const defaultContext = {
    theme: 'dark',
    setTheme: () => {},
    songSortMode: 'genre',
    setTheme: () => {},
}

const SettingsContext = createContext(defaultContext);

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);

    if (!settings) {
        setSettings(JSON.parse(localStorage.getItem("lessonSettings")) ?? {});
    }

    const changeSetting = useCallback((key, value) => {
        setSettings((prev) => ({...(prev ?? {}), [key]: value}))
    }, [setSettings]);

    // Write to localstorage whenever a setting is changed
    useEffect(() => localStorage.setItem("lessonSettings", JSON.stringify(settings)), [settings]);

    const theme = settings?.theme ?? defaultContext.theme;
    const setTheme = useCallback((value) => changeSetting('theme', value), [changeSetting]);

    const songSortMode = settings?.songSortMode ?? defaultContext.songSortMode;
    const setSongSortMode = useCallback((value) => changeSetting('songSortMode', value), [changeSetting]);

    return (
        <SettingsContext.Provider
            value={useMemo(
                () => ({
                    theme,
                    setTheme,
                    songSortMode,
                    setSongSortMode,
                }),
                [
                    theme,
                    setTheme,
                    songSortMode,
                    setSongSortMode,
                ]
            )}
        >
            {children}
        </SettingsContext.Provider>
    );
}