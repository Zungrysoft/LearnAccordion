import '../App.css';
import React,{useEffect, useRef, useState} from 'react';
import Lesson from './Lesson.js'
import Connector from './Connector.js';
import songData from '../data/songs.json';
import LessonCounter from './LessonCounter.js';
import { useSettings } from '../context/SettingsProvider.jsx';

function markGraph(key, state, lessons, points, gMap) {
    // Early out if this node has already been marked in the gMap
    if (key in gMap) {
        return;
    }
    // Early out if this node is marked as completed
    if (state[key]?.completed === true || Object.values(state[key]?.subtasks ?? {}).filter((x) => x).length >= lessons[key].subtasks_required) {
        gMap[key] = 0;
        return;
    }
    // Early out if we have no prerequisites
    if (lessons[key].prerequisites.length === 0) {
        gMap[key] = 1;
        return;
    }

    // Mark as found so we don't end up with recursion
    gMap[key] = 9999;

    let lesson = lessons[key];
    let prereqDistances = [];
    let closestParentDistance = 9999;
    for (let prerequisite of lesson.prerequisites) {
        let optionDistances = [];
        for (let option of prerequisite) {
            markGraph(option, state, lessons, points, gMap)
            let distance = gMap[option];
            closestParentDistance = Math.min(closestParentDistance, distance)
            if (!lessons[option].is_connector) {
                distance ++;
            }
            optionDistances.push(distance);
        }
        prereqDistances.push(Math.min(...optionDistances));
    }

    gMap[key] = Math.max(...prereqDistances);

    // If one of the parents is selectable (<= 1), then this should be threshold
    // at minimum. This helps prevent the user from not realizing the next
    // lesson isn't showing up because it has some other prerequisite on a
    // less-completed branch of the tree
    if (closestParentDistance <= 1 && gMap[key] > 1) {
        gMap[key] = 2;
    }

    // If this is a star gate, mark it as completed if user has enough stars and is unlocked
    if (lesson.type === 'gate') {
        if (gMap[key] <= 1 && points >= lesson.points_required) {
            gMap[key] = 0;
        }
    }
    
}

// Recursive DFS search that marks each lesson in gMap by its distance from the nearest completed lesson
function buildGraph(state, lessons, points) {
    let gMap = {}
    for (let key in lessons) {
        let lesson = lessons[key]
        if (!(lesson in gMap)) {
            markGraph(key, state, lessons, points, gMap)
        }
    }

    // If a lesson is at threshold (not unlocked, but previewed), make sure all
    // of its parents are at threshold as well so the user knows that there are
    // other requirements to unlock it as well
    let atThreshold = [];
    for (const key in lessons) {
        if (gMap[key] <= 2 /* && gMap[key] > 0 */) {
            atThreshold.push(key)
        }
    }
    for (const key of atThreshold) {
        let lesson = lessons[key]
        for (let prerequisite of lesson.prerequisites) {
            for (let option of prerequisite) {
                if (gMap[option] > 2) {
                    gMap[option] = 2;
                }
            }
        }
    }


    return gMap
}

// Build a map of each lesson and its completion status
function buildLessonStates(state, lessons, points, showLockedLessons) {
    // Build a map from each lesson to its distance from the nearest completed lesson
    let gMap = buildGraph(state, lessons, points)

    let ret = {}
    for (let key in lessons) {
        if (lessons[key].is_connector) {
            ret[key] = {
                completed: gMap[key] <= 1,
                unlocked: gMap[key] <= 1,
                threshold: gMap[key] <= 2 || showLockedLessons,
                selectable: false,
            }
        }
        else {
            ret[key] = {
                completed: gMap[key] <= 0,
                unlocked: gMap[key] <= 1,
                threshold: gMap[key] <= 2 || showLockedLessons,
                selectable: gMap[key] <= 1 || showLockedLessons,
            }
        }
    }
    return ret;
}

function Board({ lessons, state, onOpenPage }) {
    let points = 0;
    Object.entries(songData).forEach(([id, song]) => {
        if (state[id]?.completed) {
            points += song.points ?? 0;
        }
    })
    const { showLockedLessons } = useSettings();
    const builtLessons = buildLessonStates(state, lessons, points, showLockedLessons);
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
                {Object.keys(lessons).map((key) => (
                    <Lesson
                        key={key}
                        lesson={lessons[key]}
                        state={builtLessons[key]}
                        boardSize={boardSize}
                        onSetPage={() => {
                            onOpenPage(key)
                        }}
                    />
                ))}
                {Object.keys(lessons).map((key) => (
                    lessons[key].prerequisites.map((options) => (
                        options.map((option) => (
                            <Connector
                                key={`${option}-${key}`}
                                lesson1={lessons[option]}
                                lesson2={lessons[key]}
                                state1={builtLessons[option]}
                                state2={builtLessons[key]}
                                boardSize={boardSize}
                            />
                        ))
                    ))
                ))}
            </div>
            <LessonCounter state={state}/>
        </div>
    )
}




export default Board;
