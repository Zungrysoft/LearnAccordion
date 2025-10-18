import React,{useCallback, useMemo, useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import CheckBox from './components/CheckBox';
import lessonData from './data/lessons.json';
import songData from './data/songs.json';
import LessonPage from './components/LessonPage.js';
import Tabs from './components/Tabs.js';
import SongTable from './components/SongTable.js';
import { useTheme } from './helpers/theme.jsx';
import SettingsPage from './components/SettingsPage.js';
import { useSettings } from './context/SettingsProvider.jsx';
import ExercisesPage from './components/ExercisesPage.js';

function MainPage() {
    const { colorBackground, colorText } = useTheme();
    const [activeTab, setActiveTab] = useState('lessons');
    const { showLockedLessons, setShowLockedLessons } = useSettings();
    
    const [currentPage, setCurrentPage] = useState(Object.keys(lessonData)[0]);
    const [pageOpen, setPageOpen] = useState(false);

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
            {activeTab === 'lessons' && (
                <div style={{ flex: 1, overflowY: 'scroll', minHeight: 0 }}>
                    <Board
                        onOpenPage={(lessonKey) => {
                            setCurrentPage(lessonKey);
                            setPageOpen(true);
                        }}
                    />
                    <div className="top-right">
                        <CheckBox
                            text="Show later lessons:"
                            onChange={() => setShowLockedLessons((prev) => !prev)}
                            checked={showLockedLessons}
                            textColor={colorText}
                        />
                    </div>
                </div>
            )}
            {activeTab === 'exercises' && (
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ExercisesPage/>
                </div>
            )}
            {activeTab === 'songs' && (
                <div style={{ flex: 1, minHeight: 0 }}>
                    <SongTable
                        onOpenPage={(lessonKey) => {
                            setCurrentPage(lessonKey);
                            setPageOpen(true);
                        }}/>
                </div>
            )}
            {activeTab === 'settings' && (
                <SettingsPage/>
            )}

            <LessonPage
                lessonId={currentPage}
                onClose={() => {setPageOpen(false)}}
                isOpen={pageOpen}
            />
        </div>
    );
}

export default MainPage;
