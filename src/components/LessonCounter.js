import '../App.css';

import settingsData from '../data/settings.json';

function LessonCounter({ lessonStates }) {
    let total = 0
    let completed = 0
    for (let lesson of Object.values(lessonStates)) {
        total ++
        if (lesson.completed) {
            completed ++
        }
    }

    return (
        <div className="bottom-left">
            <h2 style={{color: settingsData.connector_color_completed}}>{completed + "/" + total}</h2>
        </div>
    )
}

export default LessonCounter;
