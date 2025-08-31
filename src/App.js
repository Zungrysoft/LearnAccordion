import React,{useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import CheckBox from './components/CheckBox';
import lessonData from './data/lessons.json';
import settingsData from './data/settings.json';
import LessonPage from './components/LessonPage.js';

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
        lesson.y = height;
    }

    for (const childLessonKey of lesson.childLessons) {
        const childLesson = lessonData[childLessonKey];
        dfsLessonHeights(lessonData, childLesson, height+1)
    }
}

function App() {
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

    useEffect(() => {
        if (pageOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [pageOpen]);

    return (
        <div className="App">
            <Board
                lessons={processedLessonData}
                state={lessonState}
                onOpenPage={(lessonKey) => {
                    setCurrentPage(lessonKey);
                    setPageOpen(true);
                }}
            />
            <LessonPage
                lesson={processedLessonData[currentPage]}
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
            <div className="top-right">
                <CheckBox
                    text="Show later lessons:"
                    onChange={(newState) => {
                        let newOverallState = {
                            ...lessonState,
                            _show_later: newState
                        }
                        setLessonState(newOverallState)
                        localStorage.setItem("lessonState", JSON.stringify(newOverallState))
                    }}
                    checked={lessonState._show_later}
                    textColor={settingsData.connector_color_completed}
                />
            </div>
        </div>
    );
}

export default App;
