import React,{useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import CheckBox from './components/CheckBox';
import lessonData from './data/lessons.json';
import settingsData from './data/settings.json';

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
            <div className="bottom-item">
                <CheckBox
                    text="Show later lessons:"
                    onChange={(newState) => {
                        let newOverallState = {
                            ...lessonState,
                            _show_later: newState
                        }
                        setLessonState(newOverallState)
                        localStorage.setItem("lessonState", JSON.stringify(newOverallState))
                    }}
                    checked={lessonState._show_later}
                    textColor={settingsData.connector_color_completed}
                />
            </div>
        </div>
    );
}

export default App;
