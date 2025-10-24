import '../App.css';
import React,{useEffect, useRef, useState} from 'react';
import Lesson from './Lesson.js'
import Connector from './Connector.js';
import LessonCounter from './LessonCounter.js';
import { useLessonState } from '../context/LessonStateProvider.jsx';
import { getOptionData } from '../helpers/progression.js';

function Board({ onOpenPage }) {
    const { lessonState, lessonData } = useLessonState();

    const divRef = useRef(null);
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!divRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setBoardSize({ width, height });
            }
        });

        observer.observe(divRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={divRef} style={{ width: '100%', height: '100%' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {Object.keys(lessonData).map((key) => (
                    <Lesson
                        key={key}
                        lesson={lessonData[key]}
                        state={lessonState[key]}
                        boardSize={boardSize}
                        onSetPage={() => {
                            onOpenPage(key)
                        }}
                    />
                ))}
                {Object.keys(lessonData).map((key) => (
                    lessonData[key].prerequisites.map((options) => (
                        options.map((option) => {
                            const { optionId, pointsRequired, flipPointsPosition, bendiness } = getOptionData(option);
                            return (
                                <Connector
                                    key={`${optionId}-${key}`}
                                    lesson1={lessonData[optionId]}
                                    lesson2={lessonData[key]}
                                    state1={lessonState[optionId]}
                                    state2={lessonState[key]}
                                    pointsRequired={pointsRequired}
                                    flipPointsPosition={flipPointsPosition}
                                    bendiness={bendiness}
                                    boardSize={boardSize}
                                />
                            );
                        })
                    ))
                ))}
            </div>
            <LessonCounter/>
        </div>
    )
}




export default Board;
