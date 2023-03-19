import React,{useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import lessonData from './data/lessons.json';

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

function App() {
    const [lessonState, setLessonState] = useState(getDefaultStorage())
    return (
        <div className="App">
            <Board
                lessons={lessonData}
                state={lessonState}
                onChange={(newState) => {
                    setLessonState(newState)
                    localStorage.setItem("lessonState", JSON.stringify(newState))
                }}
            />
        </div>
    );
}

export default App;
