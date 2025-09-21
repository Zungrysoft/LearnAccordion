import '../App.css';

import songData from '../data/songs.json';
import { useTheme } from '../helpers/theme';

function LessonCounter({ state }) {
    const { colorText, filterIcon } = useTheme();

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
            <h2 style={{color: colorText}}>Lessons: {completed + "/" + total}</h2>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '4px'}}>
                <h2 style={{ color: colorText, fontSize: 18, margin: 0}}>{points}</h2>
                <img
                    src={`${process.env.PUBLIC_URL}/icon/star.png`}
                    alt=""
                    style={{
                        width: '18px',
                        height: '18px',
                        filter: filterIcon,
                    }}
                />
            </div>
        </div>
    )
}

export default LessonCounter;
