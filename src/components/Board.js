import '../App.css';
import React,{useEffect, useRef, useState} from 'react';
import Lesson from './Lesson.js'
import Connector from './Connector.js';
import songData from '../data/songs.json';
import LessonCounter from './LessonCounter.js';

function markGraph(key, state, lessons, points, gMap) {
    // Early out if this node has already been marked in the gMap
    if (key in gMap) {
        return
    }
    // Early out if this node is marked as completed
    if (state[key]?.completed === true || Object.values(state[key]?.subtasks ?? {}).filter((x) => x).length >= lessons[key].subtasks_required) {
        gMap[key] = 0
        return
    }
    // Early out if we have no prerequisites
    if (lessons[key].prerequisites.length === 0) {
        gMap[key] = 1
        return
    }

    // Mark as found so we don't end up with recursion
    gMap[key] = 999

    let lesson = lessons[key]
    let prereqDistances = []
    for (let prerequisite of lesson.prerequisites) {
        let optionDistances = []
        for (let option of prerequisite) {
            markGraph(option, state, lessons, points, gMap)
            let distance = gMap[option]
            if (!lessons[option].is_connector) {
                distance ++
            }
            optionDistances.push(distance)
        }
        prereqDistances.push(Math.min(...optionDistances))
    }

    gMap[key] = Math.max(...prereqDistances)

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
    return gMap
}

// Build a map of each lesson and its completion status
function buildLessonStates(state, lessons, points) {
    // Build a map from each lesson to its distance from the nearest completed lesson
    let gMap = buildGraph(state, lessons, points)

    // If all nodes should be shown
    let showLater = state._show_later?true:false

    let ret = {}
    for (let key in lessons) {
        if (lessons[key].is_connector) {
            ret[key] = {
                completed: gMap[key] <= 1,
                unlocked: gMap[key] <= 1,
                threshold: gMap[key] <= 2 || showLater,
                selectable: false,
            }
        }
        else {
            ret[key] = {
                completed: gMap[key] <= 0,
                unlocked: gMap[key] <= 1,
                threshold: gMap[key] <= 2 || showLater,
                selectable: gMap[key] <= 1 || showLater,
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
    const builtLessons = buildLessonStates(state, lessons, points);
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
