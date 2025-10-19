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

    // const theme = settings?.theme ?? defaultContext.theme;
    // const setTheme = useCallback((value) => changeSetting('theme', value), [changeSetting]);

    // const songSortMode = settings?.songSortMode ?? defaultContext.songSortMode;
    // const setSongSortMode = useCallback((value) => changeSetting('songSortMode', value), [changeSetting]);

    // const filterHandsMode = settings?.filterHandsMode ?? defaultContext.filterHandsMode;
    // const setFilterHandsMode = useCallback((value) => changeSetting('filterHandsMode', value), [changeSetting]);

    // const filterVocalsMode = settings?.filterVocalsMode ?? defaultContext.filterVocalsMode;
    // const setFilterVocalsMode = useCallback((value) => changeSetting('filterVocalsMode', value), [changeSetting]);

    // const showLockedSongs = settings?.showLockedSongs ?? defaultContext.showLockedSongs;
    // const setShowLockedSongs = useCallback((value) => changeSetting('showLockedSongs', value), [changeSetting]);

    // const showHiddenSongs = settings?.showHiddenSongs ?? defaultContext.showHiddenSongs;
    // const setShowHiddenSongs = useCallback((value) => changeSetting('showHiddenSongs', value), [changeSetting]);

    // const showLockedLessons = settings?.showLockedLessons ?? defaultContext.showLockedLessons;
    // const setShowLockedLessons = useCallback((value) => changeSetting('showLockedLessons', value), [changeSetting]);

    // const showLockedExercises = settings?.showLockedExercises ?? defaultContext.showLockedExercises;
    // const setShowLockedExercises = useCallback((value) => changeSetting('showLockedExercises', value), [changeSetting]);

    const providerValue = useMemo(() => {
        const ret = {};

        for (const settingKey in defaultContext) {
            const settingSetKey = 'set' + settingKey[0].toUpperCase() + settingKey.substring(1);

            ret[settingKey] = settings?.[settingKey] ?? defaultContext[settingKey];
            ret[settingSetKey] = (value) => changeSetting(settingKey, value);
        }

        return ret;

    }, [changeSetting, settings])

    console.log(providerValue)

    return (
        <SettingsContext.Provider
            value={providerValue}
        >
            {children}
        </SettingsContext.Provider>
    );
}