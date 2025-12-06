import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import lessonData from '../data/lessons.json';
import exerciseData from '../data/exercises.json';
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
    exerciseList: [],
    lessonState: {},
    setLessonCompleted: () => { },
    setLessonSubtaskCompleted: () => { },
    setLessonPinned: () => { },
    completedLessonCount: 0,
    totalLessonCount: 0,
    totalSongCount: 0,
    totalExerciseCount: 0,
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

    const processedLessonData = useMemo(() => processLessonData(lessonData), []);
    const builtLessonState = buildLessonStates(rawLessonState, processedLessonData, points, showLockedLessons);

    let totalSongCount = 0;
    for (const songId in songData) {
        builtLessonState[songId] = {
            completed: !!(rawLessonState[songId]?.completed),
            pinned: !!(rawLessonState[songId]?.pinned),
        }
        if (!songData[songId].is_hidden) {
            totalSongCount ++;
        }
    }
    
    let totalExerciseCount = 0;
    for (const exerciseId in exerciseData) {
        builtLessonState[exerciseId] = {
            completed: !!(rawLessonState[exerciseId]?.completed),
            pinned: !!(rawLessonState[exerciseId]?.pinned),
        }
        if (!exerciseData[exerciseId].is_hidden) {
            totalExerciseCount ++;
        }
    }

    const { completedLessonCount, totalLessonCount } = useMemo(() => {
        let total = 0
        let completed = 0
        Object.entries(lessonData).forEach(([id, lesson]) => {
            total ++;
            if (builtLessonState[id]?.completed) {
                completed ++;
            }
        });
        return {
            completedLessonCount: completed,
            totalLessonCount: total,
        };
    }, [builtLessonState])

    const saveLessonState = useCallback((newState) => {
        setRawLessonState(newState);
        localStorage.setItem("lessonState", JSON.stringify(newState))
    }, [setRawLessonState])

    const setLessonCompleted = useCallback((lessonId, newState) => (
        saveLessonState({
            ...rawLessonState,
            [lessonId]: {
                ...rawLessonState[lessonId] ?? {},
                completed: newState,
            }
        })
    ), [rawLessonState, saveLessonState]);

    const setLessonSubtaskCompleted = useCallback((lessonId, subtask, newState) => (
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
    ), [rawLessonState, saveLessonState]);

    const setLessonPinned = useCallback((lessonId, newState) => (
        saveLessonState({
            ...rawLessonState,
            [lessonId]: {
                ...rawLessonState[lessonId] ?? {},
                pinned: newState,
            }
        })
    ), [rawLessonState, saveLessonState]);

    const exerciseList = useMemo(() => {
        return Object.entries(exerciseData).map(([key, value]) => ({ ...value, id: key }));
    }, []);

    return (
        <LessonStateContext.Provider
            value={useMemo(
                () => ({
                    lessonData: processedLessonData,
                    exercises: exerciseList,
                    lessonState: builtLessonState,
                    setLessonCompleted,
                    setLessonSubtaskCompleted,
                    setLessonPinned,
                    completedLessonCount,
                    totalLessonCount,
                    totalSongCount,
                    totalExerciseCount,
                    points,
                }),
                [
                    processedLessonData,
                    exerciseList,
                    builtLessonState,
                    setLessonCompleted,
                    setLessonSubtaskCompleted,
                    setLessonPinned,
                    completedLessonCount,
                    totalLessonCount,
                    totalSongCount,
                    totalExerciseCount,
                    points,
                ]
            )}
        >
            {children}
        </LessonStateContext.Provider>
    );
}