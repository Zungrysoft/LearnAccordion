import '../App.css';

import { useTheme } from '../helpers/theme';
import CheckBox from './CheckBox';
import { useSettings } from '../context/SettingsProvider';


function ShowLockedLessons() {
    const { showLockedLessons, setShowLockedLessons } = useSettings();
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
