import '../App.css';
import React,{useState} from 'react';
import Lesson from './Lesson.js'
import Connector from './Connector.js';
import LessonPage from './LessonPage.js';

function isCompleted(lesson, state) {
    if (state[lesson]) {
        return true
    }
    return false
}

function isUnlocked(lesson, state, lessons) {
    for (let prerequisite of lessons[lesson].prerequisites) {
        let found_option = false
        for (let option of prerequisite) {
            if (isCompleted(option, state, lessons)) {
                found_option = true
                break
            }
        }
        if (!found_option) {
            return false
        }
    }
    return true
}

function isThreshold(lesson, state, lessons) {
    for (let prerequisite of lessons[lesson].prerequisites) {
        let found_option = false
        for (let option of prerequisite) {
            if (isUnlocked(option, state, lessons)) {
                found_option = true
                break
            }
        }
        if (!found_option) {
            return false
        }
    }
    return true
}

function buildLessonStates(state, lessons) {
    let ret = {}
    for (let lesson in lessons) {
        ret[lesson] = {
            completed: isCompleted(lesson, state, lessons),
            unlocked: isUnlocked(lesson, state, lessons),
            threshold: isThreshold(lesson, state, lessons),
        }
    }
    return ret
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
        </div>
    )
}




export default Board;
