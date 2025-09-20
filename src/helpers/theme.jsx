import themeData from '../data/themes.json';

export function useTheme() {
    const theme = 'dark';

    return themeData[theme];
}