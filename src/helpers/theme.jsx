import { useMemo } from 'react';
import { useSettings } from '../context/SettingsProvider';
import themeData from '../data/themes.json';

export function useTheme() {
    const { theme } = useSettings();
    const themeDict = useMemo(() => {
        const rawThemeDict = themeData[theme];

        let ret = {};
        for (const key in rawThemeDict) {
            let value = rawThemeDict[key];

            // Allow theme values to reference other theme values via their key
            while (rawThemeDict[value]) {
                value = rawThemeDict[value];
            }
            ret[key] = value;
        }

        return ret;
    }, [theme]);

    return themeDict;
}