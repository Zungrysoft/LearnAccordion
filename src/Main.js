import React,{useCallback, useState} from 'react';
import './App.css';

import LessonPopup from './components/LessonPopup.js';
import NavTabs from './components/NavTabs.js';
import { useTheme } from './helpers/theme.jsx';
import { useActiveLesson } from './context/ActiveLessonProvider.jsx';
import LessonsPage from './pages/LessonsPage.js';
import ExercisesPage from './pages/ExercisesPage.js';
import SongsPage from './pages/SongsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import HomePage from './pages/HomePage.js';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MiscPage from './pages/MiscPage.js';
import { useSettings } from './context/SettingsProvider.jsx';
import { useHotkey } from './helpers/hotkey.js';
import AboutPage from './pages/AboutPage.js';

export default function Main() {
    const { colorBackground } = useTheme();
    const { activeLessonId, isLessonOpen, setIsLessonOpen } = useActiveLesson();
    const location = useLocation();
    const currentPath = location.pathname;
    const { isDeveloper, setIsDeveloper } = useSettings();

    const toggleDeveloper = useCallback(() => {
        setIsDeveloper((prev) => !prev);
    }, [setIsDeveloper])

    useHotkey(toggleDeveloper, 'j', true, true, true);

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colorBackground }}>
            {currentPath !== "/" && isDeveloper && (
                <NavTabs
                    tabs={[
                        {
                            icon: 'home',
                            url: '/',
                            style: { maxWidth: '64px' },
                        },
                        {
                            title: 'Lessons',
                            url: '/lessons',
                        },
                        {
                            title: 'Exercises',
                            url: '/exercises',
                        },
                        {
                            title: 'Songs',
                            url: '/songs',
                        },
                        {
                            icon: 'menu',
                            url: '/misc',
                            style: { maxWidth: '64px' },
                        },
                    ]}
                />
            )}
            <div style={{ flex: 1, minHeight: 0 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/lessons" element={<LessonsPage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/songs" element={<SongsPage />} />
                    <Route path="/misc/*" element={<MiscPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>

            <LessonPopup
                lessonId={activeLessonId}
                onClose={() => {setIsLessonOpen(false)}}
                isOpen={isLessonOpen}
            />
        </div>
    );
}
