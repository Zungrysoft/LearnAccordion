import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fillKeys } from '../helpers/misc';
import { useLessonState } from './LessonStateProvider';
import { weightedPick } from '../helpers/random';

export const exerciseFrequencyMap = [
    { display: "Never", weight: 0 },
    { display: "Very Frequently", weight: 1000 },
    { display: "Frequently", weight: 400 },
    { display: "Every so often", weight: 120 },
    { display: "Not often", weight: 45 },
    { display: "Rarely", weight: 15 },
    { display: "Very Rarely", weight: 5 },
];

const defaultContext = {
    getExerciseFrequency: () => {},
    setExerciseFrequency: () => {},
    regimenSize: 0,
    setRegimenSize: () => {},
    generateRegimen: () => {},
    regimen: [],
    exercisesAvailableForRegimen: 0,
}

const ExerciseSettingsContext = createContext(defaultContext);

export const useExerciseSettings = () => useContext(ExerciseSettingsContext);

export function ExerciseSettingsProvider({ isExerciseSettings, children }) {
    const [exerciseSettingsData, setExerciseSettingsData] = useState(null);
    const { exercises } = useLessonState();

    if (!exerciseSettingsData) {
        setExerciseSettingsData(JSON.parse(localStorage.getItem("lessonExerciseSettings")) ?? {});
    }

    // Write to localstorage whenever a setting is changed
    useEffect(() => localStorage.setItem("lessonExerciseSettings", JSON.stringify(exerciseSettingsData)), [exerciseSettingsData]);

    const getExerciseFrequency = useCallback((exerciseId) => {
        return exerciseSettingsData?.exercises?.[exerciseId]?.frequency ?? 0;
    }, [exerciseSettingsData]);

    const setExerciseFrequency = useCallback((exerciseId, frequency) => {
        setExerciseSettingsData((prev) => {
            fillKeys(prev, ['exercises', exerciseId]);
            prev.exercises[exerciseId].frequency = frequency;
            return {...prev};
        });
    }, [exerciseSettingsData, setExerciseSettingsData]);

    const regimenSize = exerciseSettingsData?.regimenSize ?? 4;
    
    const setRegimenSize = useCallback((value) => {
        if (typeof value === 'function') {
            const setterFunction = value;
            setExerciseSettingsData((prev) => ({ ...prev, regimenSize: setterFunction(regimenSize) }));
        }
        else {
            setExerciseSettingsData((prev) => ({ ...prev, regimenSize: value }));
        }
    }, [exerciseSettingsData, setExerciseSettingsData, regimenSize]);

    const exercisesAvailableForRegimen = useMemo(() => {
        return exercises.filter((exercise) => getExerciseFrequency(exercise.id) > 0);
    }, [exercises, getExerciseFrequency]);
    const regimen = exerciseSettingsData?.regimen ?? [];

    const generateRegimen = useCallback(() => {
        const available = [...exercisesAvailableForRegimen];
        const builtRegimen = [];
        while (available.length > 0) {
            const pickList = available.map((exercise, index) => ({
                value: index,
                weight: exerciseFrequencyMap[getExerciseFrequency(exercise.id)].weight,
            }))
            const pickedIndex = weightedPick(pickList);
            builtRegimen.push(available[pickedIndex]);
            available.splice(pickedIndex, 1);
        }
        setExerciseSettingsData((prev) => {
            return {...prev, regimen: builtRegimen};
        });
    }, [exercisesAvailableForRegimen, setExerciseSettingsData]);

    return (
        <ExerciseSettingsContext.Provider
            value={useMemo(
                () => ({
                    getExerciseFrequency,
                    setExerciseFrequency,
                    regimenSize,
                    setRegimenSize,
                    generateRegimen,
                    regimen,
                    exercisesAvailableForRegimen,
                }),
                [
                    getExerciseFrequency,
                    setExerciseFrequency,
                    regimenSize,
                    setRegimenSize,
                    generateRegimen,
                    regimen,
                    exercisesAvailableForRegimen,
                ]
            )}
        >
            {children}
        </ExerciseSettingsContext.Provider>
    );
}