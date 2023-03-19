import '../App.css';
import Lesson from './Lesson.js'
import Connector from './Connector.js';

function Board({ lessons, state, onChange }) {
    return (
        <div>
            {Object.keys(lessons).map((key) => (
                <Lesson
                    lesson={lessons[key]}
                    state={state[key]}
                    onChange={(newState) => (
                        onChange({
                            ...state,
                            [key]: newState
                        })
                    )}
                />

            ))}
            {Object.keys(lessons).map((key) => (
                lessons[key].prerequisites.map((options) => (
                    options.map((option) => (
                        <Connector
                            lesson1={lessons[key]}
                            lesson2={lessons[option]}
                        />
                    ))
                ))
            ))}
        </div>
    )
}




export default Board;
