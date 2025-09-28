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

function getDefaultStorage() {
    try {
        let ret = JSON.parse(localStorage.getItem("lessonState"))
        if (!ret) {
            ret = {}
        }
        return ret
    }
    catch {
        return {}
    }
}

function dfsLessonHeights(lessonData, lesson, height) {
    if (!lesson.y || lesson.y < height) {
        lesson.y = height + (lesson.y_offset ?? 0);
    }

    for (const childLessonKey of lesson.childLessons) {
        const childLesson = lessonData[childLessonKey];
        dfsLessonHeights(lessonData, childLesson, height+1)
    }
}

function MainPage() {
    const { colorBackground, colorText } = useTheme();
    const [activeTab, setActiveTab] = useState('lessons');
    const { showLockedLessons, setShowLockedLessons } = useSettings();

    const processedLessonData = useMemo(() => {
        let procLessonData = {};

        // Add parent lesson keys
        for (const lessonKey in lessonData) {
            const lesson = lessonData[lessonKey];

            const parentLessonKeys = new Set();
            if (lesson.prerequisites) {
                for (const prerequisite of lesson.prerequisites) {
                    for (const option of prerequisite) {
                        parentLessonKeys.add(option)
                    }
                }
            }

            procLessonData[lessonKey] = {
                ...lesson,
                parentLessons: Array.from(parentLessonKeys),
                childLessons: [],
            }
        }

        // Add child lesson keys
        for (const lessonKey in procLessonData) {
            const lesson = procLessonData[lessonKey];

            for (const parentLessonKey of lesson.parentLessons) {
                const parentLesson = procLessonData[parentLessonKey];

                parentLesson.childLessons.push(lessonKey)
            }
        }

        // Determine y positions for lessons
        for (const lessonKey in procLessonData) {
            const lesson = procLessonData[lessonKey];
            if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
                dfsLessonHeights(procLessonData, lesson, 0);
            }
        }

        return procLessonData;

    }, [lessonData])

    const [lessonState, setLessonState] = useState(getDefaultStorage());
    const [currentPage, setCurrentPage] = useState(Object.keys(processedLessonData)[0]);
    const [pageOpen, setPageOpen] = useState(false);

    const saveLessonState = useCallback((newState) => {
        setLessonState(newState);
        localStorage.setItem("lessonState", JSON.stringify(newState))
    })

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colorBackground }}>
            <Tabs tabs={[
                {
                    title: 'Lessons',
                    value: 'lessons',
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
                        lessons={processedLessonData}
                        state={lessonState} 
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
            {activeTab === 'songs' && (
                <div style={{ flex: 1, minHeight: 0 }}>
                    <SongTable
                        lessons={processedLessonData}
                        state={lessonState} 
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
                lesson={processedLessonData[currentPage] ?? songData[currentPage]}
                completionState={lessonState[currentPage]}
                onChangeCompleted={(newState) => (
                    saveLessonState({
                        ...lessonState,
                        [currentPage]: {
                            ...lessonState[currentPage] ?? {},
                            completed: newState,
                        }
                    })
                )}
                onChangePinned={(newState) => (
                    saveLessonState({
                        ...lessonState,
                        [currentPage]: {
                            ...lessonState[currentPage] ?? {},
                            pinned: newState,
                        }
                    })
                )}
                onChangeSubtask={(subtask, newState) => (
                    saveLessonState({
                        ...lessonState,
                        [currentPage]: {
                            ...lessonState[currentPage] ?? {},
                            subtasks: {
                                ...lessonState[currentPage]?.subtasks ?? {},
                                [subtask]: newState,
                            },
                        }
                    })
                )}
                onClose={() => {setPageOpen(false)}}
                isOpen={pageOpen}
            />
        </div>
    );
}

export default MainPage;
