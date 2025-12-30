import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const defaultContext = {
    isDeveloper: false,
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
    showDeveloperFilters: false,
    metronomeBpm: 100,
    metronomeVolume: 0.7,
    metronomeTimeSignature: '4/4',
    showPinnedExercises: false,
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