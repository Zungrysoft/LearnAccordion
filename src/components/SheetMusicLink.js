import '../App.css';

import lessonData from '../data/lessons.json';
import { useTheme } from '../helpers/theme';
import { useLessonState } from '../context/LessonStateProvider';
import IconStar from './IconStar';


function SheetMusicLink({ file, text }) {
    const { colorText } = useTheme();

    if (!file) {
        return null;
    }

    return (
        <a
            style={{ color: colorText }}
            target="_blank"
            rel="noopener noreferrer"
            href={`${process.env.PUBLIC_URL}/sheet_music/songs/${file}.pdf`}
        >
            {text ?? 'View sheet music'}
        </a>
    )
}

export default SheetMusicLink;
