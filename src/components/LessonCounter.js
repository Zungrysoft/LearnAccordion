import '../App.css';

import settingsData from '../data/settings.json';
import songData from '../data/songs.json';

function LessonCounter({ state }) {
    let total = 0
    let completed = 0
    for (let lesson of Object.values(state)) {
        total ++
        if (lesson.completed) {
            completed ++
        }
    }

    let points = 0;
    Object.entries(songData).forEach(([id, song]) => {
        if (state[id]?.completed) {
            points += song.points ?? 0;
        }
    })

    return (
        <div className="top-left">
            <h2 style={{color: settingsData.connector_color_completed}}>Lessons: {completed + "/" + total}</h2>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '4px'}}>
                <h2 style={{ color: 'white', fontSize: 18, margin: 0}}>{points}</h2>
                <img
                    src={`${process.env.PUBLIC_URL}/icon/star.png`}
                    alt=""
                    style={{
                        width: '18px',
                        height: '18px',
                        filter: 'invert(1)',
                    }}
                />
            </div>
        </div>
    )
}

export default LessonCounter;
