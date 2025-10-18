import '../App.css';

import lessonData from '../data/lessons.json';
import { useTheme } from '../helpers/theme';
import { useLessonState } from '../context/LessonStateProvider';


function LessonCounter() {
    const { colorText, filterIcon } = useTheme();
    const { lessonState, points } = useLessonState();

    let total = 0
    let completed = 0
    Object.entries(lessonData).forEach(([id, lesson]) => {
        total ++;
        if (lessonState[id]?.completed) {
            completed ++;
        }
    });

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
