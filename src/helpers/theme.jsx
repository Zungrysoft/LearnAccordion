import { useSettings } from '../context/SettingsProvider';
import themeData from '../data/themes.json';

export function useTheme() {
    const { theme } = useSettings();

    return themeData[theme];
}