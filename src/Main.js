import React,{useState} from 'react';
import './App.css';

import LessonPopup from './components/LessonPopup.js';
import Tabs from './components/Tabs.js';
import { useTheme } from './helpers/theme.jsx';
import { useActiveLesson } from './context/ActiveLessonProvider.jsx';
import LessonsPage from './pages/LessonsPage.js';
import ExercisesPage from './pages/ExercisesPage.js';
import SongsPage from './pages/SongsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import HomePage from './pages/HomePage.js';
import { Route, Routes, useLocation } from 'react-router-dom';

export default function Main() {
    const { colorBackground } = useTheme();
    const { activeLessonId, isLessonOpen, setIsLessonOpen } = useActiveLesson();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colorBackground }}>
            {currentPath !== "/" && (
                <Tabs
                    tabs={[
                        {
                            icon: 'home',
                            url: '/',
                            style: { maxWidth: '64px' },
                        },
                        {
                            title: 'Lessons',
                            url: 'lessons',
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
                            icon: 'gear',
                            url: '/settings',
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
                    <Route path="/settings" element={<SettingsPage />} />
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
