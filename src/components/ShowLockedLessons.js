import '../App.css';

import { useTheme } from '../helpers/theme';
import { useLessonState } from '../context/LessonStateProvider';
import CheckBox from './CheckBox';


function ShowLockedLessons() {
    const { showLockedLessons, setShowLockedLessons } = useLessonState();
    const { colorText } = useTheme();

    return (
        <div className="top-right">
            <CheckBox
                text="Show later lessons:"
                onChange={() => setShowLockedLessons((prev) => !prev)}
                checked={showLockedLessons}
                textColor={colorText}
            />
        </div>
    )
}

export default ShowLockedLessons;
