import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import themeData from '../data/themes.json';

// const defaultContext = {
//     theme: 'light',
//     setTheme: () => {},
//     songSortMode: 'genre',
//     setTheme: () => {},
//     filterHandsMode: null,
//     setFilterHandsMode: () => {},
//     filterVocalsMode: null,
//     setFilterVocalsMode: () => {},
//     showLockedSongs: false,
//     setShowLockedSongs: () => {},
//     showHiddenSongs: false,
//     setShowHiddenSongs: () => {},
//     showLockedLessons: false,
//     setShowLockedLessons: () => {},
//     showLockedExercises: false,
//     setShowLockedExercises: () => {},
//     showRightHandExercises: true,
//     setShowRightHandExercises: () => {},
//     showLeftHandExercises: true,
//     setShowLeftHandExercises: () => {},
//     showTwoHandExercises: true,
//     setShowTwoHandExercises: () => {},
// }

const defaultContext = {
    theme: 'light',
    songSortMode: 'genre',
    filterHandsMode: null,
    filterVocalsMode: null,
    showLockedSongs: false,
    showHiddenSongs: false,
    showLockedLessons: false,
    showLockedExercises: false,
    showRightHandExercises: true,
    showLeftHandExercises: true,
    showTwoHandExercises: true,
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
            const setterFunction = value;
            setSettings((prev) => ({...(prev ?? {}), [key]: setterFunction(prev[key] ?? defaultContext[key])}))
        }
        else {
            setSettings((prev) => ({...(prev ?? {}), [key]: value}))
        }
        
    }, [setSettings]);

    // Write to localstorage whenever a setting is changed
    useEffect(() => localStorage.setItem("lessonSettings", JSON.stringify(settings)), [settings]);

    const providerValue = useMemo(() => {
        const ret = {};

        for (const settingKey in defaultContext) {
            const settingSetKey = 'set' + settingKey[0].toUpperCase() + settingKey.substring(1);

            ret[settingKey] = settings?.[settingKey] ?? defaultContext[settingKey];
            ret[settingSetKey] = (value) => changeSetting(settingKey, value);
        }

        return ret;

    }, [changeSetting, settings])

    return (
        <SettingsContext.Provider
            value={providerValue}
        >
            {children}
        </SettingsContext.Provider>
    );
}