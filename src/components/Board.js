import '../App.css';
import React,{useState} from 'react';
import Lesson from './Lesson.js'
import Connector from './Connector.js';
import LessonPage from './LessonPage.js';
import LessonCounter from './LessonCounter.js';

function minList(l) {
    let min = l[0]
    for (let elem of l) {
        if (elem.distance < min.distance) {
            min = elem
        }
    }
    return min
}

function maxList(l) {
    let max = l[0]
    for (let elem of l) {
        if (elem.distance > max.distance) {
            max = elem
        }
    }
    return max
}

function markGraph(key, state, lessons, gMap) {
    // Early out if this node has already been marked in the gMap
    if (key in gMap) {
        return
    }
    // Early out if this node is marked as completed
    if (state[key] === true) {
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
            markGraph(option, state, lessons, gMap)
            optionDistances.push({
                distance: gMap[option],
                lessonKey: option
            })
        }
        prereqDistances.push(minList(optionDistances))
    }

    // Cal
    let results = maxList(prereqDistances)
    if (!lessons[results.lessonKey].is_connector) {
        results.distance ++
    }
    gMap[key] = results.distance
}

// Recursive DFS search that marks each lesson in gMap by its distance from the nearest completed lesson
function buildGraph(state, lessons) {
    let gMap = {}
    for (let key in lessons) {
        let lesson = lessons[key]
        if (!(lesson in gMap)) {
            markGraph(key, state, lessons, gMap)
        }
    }
    return gMap
}

// Build a map of each lesson and its completion status
function buildLessonStates(state, lessons) {
    // Build a map from each lesson to its distance from the nearest completed lesson
    let gMap = buildGraph(state, lessons)

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
    return ret


    // let showLater = state._show_later?true:false
    // let ret = {}
    // for (let lesson in lessons) {
    //     if (lessons[lesson].is_connector) {
    //         let u = isUnlocked(lesson, state, lessons)
    //         let t = u || showLater
    //         ret[lesson] = {
    //             completed: u,
    //             unlocked: u,
    //             threshold: t,
    //             selectable: false,
    //         }
    //     }
    //     else {
    //         let c = isCompleted(lesson, state, lessons)
    //         let u = c || isUnlocked(lesson, state, lessons)
    //         let t =  c || u || showLater || isThreshold(lesson, state, lessons)
    //         let s = u || showLater
    //         ret[lesson] = {
    //             completed: c,
    //             unlocked: u,
    //             threshold: t,
    //             selectable: s,
    //         }
    //     }
    // }
    // return ret
}

function Board({ lessons, state, onChange }) {
    const [currentPage, setCurrentPage] = useState(Object.keys(lessons)[0])
    const [pageOpen, setPageOpen] = useState(false)
    const builtLessons = buildLessonStates(state, lessons)
    return (
        <div>
            {Object.keys(lessons).map((key) => (
                <Lesson
                    lesson={lessons[key]}
                    state={builtLessons[key]}
                    onSetPage={() => {
                        setCurrentPage(key)
                        setPageOpen(true)
                    }}
                />
            ))}
            {Object.keys(lessons).map((key) => (
                lessons[key].prerequisites.map((options) => (
                    options.map((option) => (
                        <Connector
                            lesson1={lessons[option]}
                            lesson2={lessons[key]}
                            state1={builtLessons[option]}
                            state2={builtLessons[key]}
                        />
                    ))
                ))
            ))}
            <LessonPage
                lesson={lessons[currentPage]}
                state={builtLessons[currentPage]}
                onChange={(newState) => (
                    onChange({
                        ...state,
                        [currentPage]: newState
                    })
                )}
                onClose={() => {setPageOpen(false)}}
                isOpen={pageOpen}
            />
            <LessonCounter lessonStates={builtLessons}/>
        </div>
    )
}




export default Board;
