import '../App.css';
import Lesson from './Lesson.js'

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
        </div>
    )
}

export default Board;
