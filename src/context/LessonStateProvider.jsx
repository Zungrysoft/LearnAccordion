import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import lessonData from '../data/lessons.json';
import songData from '../data/songs.json';
import { buildLessonStates, processLessonData } from '../helpers/progression';
import { useSettings } from './SettingsProvider';

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

const defaultContext = {
    lessonData: {},
    lessonState: {},
    setLessonCompleted: () => {},
    setLessonSubtaskCompleted: () => {},
    setLessonPinned: () => {},
    points: 0,
}

const LessonStateContext = createContext(defaultContext);

export const useLessonState = () => useContext(LessonStateContext);

export function LessonStateProvider({ children }) {
    const [rawLessonState, setRawLessonState] = useState(getDefaultStorage());
    const { showLockedLessons } = useSettings();

    let points = 0;
    Object.entries(songData).forEach(([id, song]) => {
        if (rawLessonState[id]?.completed) {
            points += song.points ?? 0;
        }
    })

    const processedLessonData = useMemo(() => processLessonData(lessonData), [lessonData]);
    const builtLessonState = buildLessonStates(rawLessonState, processedLessonData, points, showLockedLessons);

    for (const songId in songData) {
        builtLessonState[songId] = {
            completed: !!(rawLessonState[songId]?.completed),
            pinned: !!(rawLessonState[songId]?.pinned),
        }
    }
    

    const saveLessonState = useCallback((newState) => {
        setRawLessonState(newState);
        localStorage.setItem("lessonState", JSON.stringify(newState))
    })

    const setLessonCompleted = (lessonId, newState) => (
        saveLessonState({
            ...rawLessonState,
            [lessonId]: {
                ...rawLessonState[lessonId] ?? {},
                completed: newState,
            }
        })
    )

    const setLessonSubtaskCompleted = (lessonId, subtask, newState) => (
        saveLessonState({
            ...rawLessonState,
            [lessonId]: {
                ...rawLessonState[lessonId] ?? {},
                subtasks: {
                    ...rawLessonState[lessonId]?.subtasks ?? {},
                    [subtask]: newState,
                },
            }
        })
    )

    const setLessonPinned = (lessonId, newState) => (
        saveLessonState({
            ...rawLessonState,
            [lessonId]: {
                ...rawLessonState[lessonId] ?? {},
                pinned: newState,
            }
        })
    )

    

    return (
        <LessonStateContext.Provider
            value={useMemo(
                () => ({
                    lessonData: processedLessonData,
                    lessonState: builtLessonState,
                    setLessonCompleted,
                    setLessonSubtaskCompleted,
                    setLessonPinned,
                    points,
                }),
                [
                    processedLessonData,
                    builtLessonState,
                    setLessonCompleted,
                    setLessonSubtaskCompleted,
                    setLessonPinned,
                    points,
                ]
            )}
        >
            {children}
        </LessonStateContext.Provider>
    );
}