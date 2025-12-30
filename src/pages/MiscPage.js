import '../App.css';
import NavTabs from '../components/NavTabs.js';
import { useTheme } from '../helpers/theme.jsx';
import AboutPage from './AboutPage.js';
import SettingsPage from './SettingsPage.js';
import { Navigate, Route, Routes } from 'react-router-dom';
import SheetMusicRepositoryPage from './SheetMusicRepositoryPage.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import { useMemo } from 'react';

const TABS = [
    { title: 'About', url: '/misc' },
    { title: 'Settings', url: '/misc/settings' },
    { title: 'Sheet Music Repository', url: '/misc/sheet_music' },
    // { title: 'Glossary', url: '/misc/glossary' },
    // { title: 'Resources', url: '/misc/resources' },
]

export default function MiscPage() {
    const { colorBackgroundDark } = useTheme();
    const { isDeveloper } = useSettings();

    const tabs = useMemo(() => {
        if (!isDeveloper) {
            return TABS.filter((tab) => !tab.developerOnly);
        }
        return TABS;
    }, [isDeveloper]);

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
            <div style={{ flex: 0, display: 'flex', flexDirection: 'column', minWidth: '300px', width: '300px', height: '100%', backgroundColor: colorBackgroundDark }}>
                <NavTabs
                    tabs={tabs}
                    isVertical
                    requireExactUrlMatch
                />
            </div>
            <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/sheet_music" element={<SheetMusicRepositoryPage />} />
                <Route path="*" element={<Navigate to="/misc" replace />} />
            </Routes>
        </div>
    );
}
