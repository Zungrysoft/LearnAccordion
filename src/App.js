import React,{useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import lessonData from './data/lessons.json';

function App() {
    const [lessonState, setLessonState] = useState({})
    return (
        <div className="App">
            <Board
                lessons={lessonData}
                state={lessonState}
                onChange={setLessonState}
            />
        </div>
    );
}

export default App;
