import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const defaultExerciseState = {
    completed: false,
    showSolution: false,
    lastSeen: new Date(),
};

const defaultContext = {
    activeExerciseId: () => {},
    setActiveExerciseId: () => {},
    getExerciseState: () => defaultExerciseState,
    setExerciseCompleted: () => {},
    setExerciseShowSolution: () => {},
    showPreviousExercises: false,
    setShowPreviousExercises: () => {},
    difficulty: 1,
    setDifficulty: () => {},
}

const SightReadingContext = createContext(defaultContext);

export const useSightReading = () => useContext(SightReadingContext);

export function SightReadingProvider({ isSightReading, children }) {
    const [sightReadingData, setSightReadingData] = useState(null);

    if (!sightReadingData) {
        setSightReadingData(JSON.parse(localStorage.getItem("lessonSightReading")) ?? {});
    }

    // Write to localstorage whenever a setting is changed
    useEffect(() => localStorage.setItem("lessonSightReading", JSON.stringify(sightReadingData)), [sightReadingData]);

    const getExerciseState = useCallback((sightReadingExerciseId) => {
        let curState = {};
        Object.keys(defaultExerciseState).forEach((key) => {
            const keyVal = sightReadingData?.states?.[sightReadingExerciseId]?.[isSightReading ? `${key}SightReading` : `${key}EarTraining`];
            if (keyVal !== undefined) {
                curState[key] = keyVal;
            }
        });

        return {
            ...defaultExerciseState,
            ...curState,
        };
    }, [sightReadingData, isSightReading]);

    const setValueOnExercise = useCallback((sightReadingExerciseId, key, value) => {
        const keyWithSuffix = isSightReading ? `${key}SightReading` : `${key}EarTraining`;

        setSightReadingData((prev) => ({
            ...(prev ?? {}),
            states: {
                ...(prev?.states ?? {}),
                [sightReadingExerciseId]: {
                    ...(prev?.states?.[sightReadingExerciseId] ?? {}),
                    [keyWithSuffix]: value,
                }
            }
            
        }))
    }, [setSightReadingData, isSightReading]);

    const setExerciseCompleted = useCallback((sightReadingExerciseId, value) => {
        setValueOnExercise(sightReadingExerciseId, 'completed', value);
    }, [setValueOnExercise]);

    const setExerciseShowSolution = useCallback((sightReadingExerciseId, value) => {
        setValueOnExercise(sightReadingExerciseId, 'showSolution', value);
    }, [setValueOnExercise]);

    const activeExerciseId = useMemo(
        () => sightReadingData?.[isSightReading ? 'activeExerciseIdSightReading' : 'activeExerciseIdEarTraining'] ?? "0001",
        [isSightReading, sightReadingData]
    );
    const setActiveExerciseId = useCallback((id) => {
        setSightReadingData((prev) => ({...prev, [isSightReading ? 'activeExerciseIdSightReading' : 'activeExerciseIdEarTraining']: id}));
    }, [setSightReadingData, isSightReading])

    const showPreviousExercises = useMemo(
        () => sightReadingData?.[isSightReading ? 'showPreviousExercisesSightReading' : 'showPreviousExercisesEarTraining'] ?? false,
        [isSightReading, sightReadingData]
    );
    const setShowPreviousExercises = useCallback((value) => {
        setSightReadingData((prev) => {
            return ({ ...prev, [isSightReading ? 'showPreviousExercisesSightReading' : 'showPreviousExercisesEarTraining']: value });
        });
    }, [setSightReadingData, isSightReading])

    const difficulty = useMemo(
        () => sightReadingData?.[isSightReading ? 'difficultySightReading' : 'difficultyEarTraining'] ?? 1,
        [isSightReading, sightReadingData]
    );
    const setDifficulty = useCallback((value) => {
        setSightReadingData((prev) => {
            return ({ ...prev, [isSightReading ? 'difficultySightReading' : 'difficultyEarTraining']: value });
        });
    }, [setSightReadingData, isSightReading])

    return (
        <SightReadingContext.Provider
            value={useMemo(
                () => ({
                    activeExerciseId,
                    setActiveExerciseId,
                    getExerciseState,
                    setExerciseCompleted,
                    setExerciseShowSolution,
                    showPreviousExercises,
                    setShowPreviousExercises,
                    difficulty,
                    setDifficulty,
                }),
                [
                    activeExerciseId,
                    setActiveExerciseId,
                    getExerciseState,
                    setExerciseCompleted,
                    setExerciseShowSolution,
                    showPreviousExercises,
                    setShowPreviousExercises,
                    difficulty,
                    setDifficulty,
                ]
            )}
        >
            {children}
        </SightReadingContext.Provider>
    );
}