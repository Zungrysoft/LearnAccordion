import React,{useState} from 'react';
import './App.css';

import Board from './components/Board.js';
import LessonPage from './components/LessonPage.js';
import lessonData from './data/lessons.json';

function App() {
    const [lessonState, setLessonState] = useState({})
    const [currentPage, setCurrentPage] = useState(Object.keys(lessonData)[0])
    const [pageOpen, setPageOpen] = useState(false)
    return (
        <div className="App">
            <Board
                lessons={lessonData}
                state={lessonState}
                onChange={setLessonState}
                onSetPage={(page) => {
                    setCurrentPage(page)
                    setPageOpen(true)
                }}
            />
            <LessonPage
                lesson={lessonData[currentPage]}
                state={{}}
                onChange=""
                onClose={() => {setPageOpen(false)}}
                isOpen={pageOpen}
            />
        </div>
    );
}

export default App;
