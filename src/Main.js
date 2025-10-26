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

export default function Main() {
    const { colorBackground } = useTheme();
    const [activeTab, setActiveTab] = useState('lessons');
    
    const { activeLessonId, isLessonOpen, setIsLessonOpen } = useActiveLesson();

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colorBackground }}>
            <Tabs tabs={[
                {
                    title: 'Lessons',
                    value: 'lessons',
                },
                {
                    title: 'Exercises',
                    value: 'exercises',
                },
                {
                    title: 'Songs',
                    value: 'songs',
                },
                {
                    icon: 'gear',
                    value: 'settings',
                    style: { maxWidth: '64px' },
                },
            ]} activeTab={activeTab} onTabChange={setActiveTab}/>
            <div style={{ flex: 1, minHeight: 0 }}>
                {activeTab === 'lessons' && (
                    <LessonsPage/>
                )}
                {activeTab === 'exercises' && (
                    <ExercisesPage/>
                )}
                {activeTab === 'songs' && (
                    <SongsPage/>
                )}
                {activeTab === 'settings' && (
                    <SettingsPage/>
                )}
            </div>

            <LessonPopup
                lessonId={activeLessonId}
                onClose={() => {setIsLessonOpen(false)}}
                isOpen={isLessonOpen}
            />
        </div>
    );
}
