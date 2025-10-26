import '../App.css';

import lessonData from '../data/lessons.json';
import { useTheme } from '../helpers/theme';
import { useLessonState } from '../context/LessonStateProvider';
import IconStar from './IconStar';


function LessonCounter() {
    const { colorText } = useTheme();
    const { completedLessonCount, totalLessonCount, points } = useLessonState();

    return (
        <div className="top-left">
            <h2 style={{color: colorText}}>Lessons: {completedLessonCount + "/" + totalLessonCount}</h2>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '4px'}}>
                <h2 style={{ color: colorText, fontSize: 18, margin: 0}}>{points}</h2>
                <IconStar width={18} color={colorText} />
            </div>
        </div>
    )
}

export default LessonCounter;
