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
import { Route, Routes } from 'react-router-dom';

export default function Main() {
    const { colorBackground } = useTheme();
    const [activeTab, setActiveTab] = useState('lessons');
    
    const { activeLessonId, isLessonOpen, setIsLessonOpen } = useActiveLesson();

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colorBackground }}>
            <Tabs
                tabs={[
                    {
                        title: 'Lessons',
                        url: '/',
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
            <div style={{ flex: 1, minHeight: 0 }}>
                <Routes>
                    <Route path="/" element={<LessonsPage />} />
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
