import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import themeData from '../data/themes.json';

const defaultContext = {
    theme: 'dark',
    setTheme: () => {},
    songSortMode: 'genre',
    setTheme: () => {},
    filterHandsMode: null,
    setFilterHandsMode: () => {},
    filterVocalsMode: null,
    setFilterVocalsMode: () => {},
    filterLockedMode: true,
    setFilterLockedMode: () => {},
    showHiddenLessons: false,
    setShowHiddenLessons: () => {},
}

const SettingsContext = createContext(defaultContext);

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);

    if (!settings) {
        setSettings(JSON.parse(localStorage.getItem("lessonSettings")) ?? {});
    }

    const changeSetting = useCallback((key, value) => {
        if (typeof value === "function") {
            setSettings((prev) => ({...(prev ?? {}), [key]: value(prev[key])}))
        }
        else {
            setSettings((prev) => ({...(prev ?? {}), [key]: value}))
        }
        
    }, [setSettings]);

    // Write to localstorage whenever a setting is changed
    useEffect(() => localStorage.setItem("lessonSettings", JSON.stringify(settings)), [settings]);

    const theme = settings?.theme ?? defaultContext.theme;
    const setTheme = useCallback((value) => changeSetting('theme', value), [changeSetting]);

    const songSortMode = settings?.songSortMode ?? defaultContext.songSortMode;
    const setSongSortMode = useCallback((value) => changeSetting('songSortMode', value), [changeSetting]);

    const filterHandsMode = settings?.filterHandsMode ?? defaultContext.filterHandsMode;
    const setFilterHandsMode = useCallback((value) => changeSetting('filterHandsMode', value), [changeSetting]);

    const filterVocalsMode = settings?.filterVocalsMode ?? defaultContext.filterVocalsMode;
    const setFilterVocalsMode = useCallback((value) => changeSetting('filterVocalsMode', value), [changeSetting]);

    const filterLockedMode = settings?.filterLockedMode ?? defaultContext.filterLockedMode;
    const setFilterLockedMode = useCallback((value) => changeSetting('filterLockedMode', value), [changeSetting]);

    const showHiddenLessons = settings?.showHiddenLessons ?? defaultContext.showHiddenLessons;
    const setShowHiddenLessons = useCallback((value) => changeSetting('showHiddenLessons', value), [changeSetting]);

    return (
        <SettingsContext.Provider
            value={useMemo(
                () => ({
                    theme,
                    setTheme,
                    songSortMode,
                    setSongSortMode,
                    filterHandsMode,
                    setFilterHandsMode,
                    filterVocalsMode,
                    setFilterVocalsMode,
                    filterLockedMode,
                    setFilterLockedMode,
                    showHiddenLessons,
                    setShowHiddenLessons,
                }),
                [
                    theme,
                    setTheme,
                    songSortMode,
                    setSongSortMode,
                    filterHandsMode,
                    setFilterHandsMode,
                    filterVocalsMode,
                    setFilterVocalsMode,
                    filterLockedMode,
                    setFilterLockedMode,
                    showHiddenLessons,
                    setShowHiddenLessons,
                ]
            )}
        >
            {children}
        </SettingsContext.Provider>
    );
}