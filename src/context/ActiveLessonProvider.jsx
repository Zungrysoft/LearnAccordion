import { createContext, useContext, useMemo, useState } from 'react';

import lessonData from '../data/lessons.json';

const defaultContext = {
    activeLessonId: null,
    setActiveLessonId: () => {},
    isLessonOpen: false,
    setIsLessonOpen: () => {},
}

const ActiveLessonContext = createContext(defaultContext);

export const useActiveLesson = () => useContext(ActiveLessonContext);

export function ActiveLessonProvider({ children }) {
    const [activeLessonId, setActiveLessonId] = useState(Object.keys(lessonData)[0]);
    const [isLessonOpen, setIsLessonOpen] = useState(defaultContext.isLessonOpen);

    return (
        <ActiveLessonContext.Provider
            value={useMemo(
                () => ({
                    activeLessonId,
                    setActiveLessonId,
                    isLessonOpen,
                    setIsLessonOpen,
                }),
                [
                    activeLessonId,
                    setActiveLessonId,
                    isLessonOpen,
                    setIsLessonOpen,
                ]
            )}
        >
            {children}
        </ActiveLessonContext.Provider>
    );
}