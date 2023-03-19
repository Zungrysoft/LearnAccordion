import '../App.css';
import { ReactComponent as YourSvg } from '../icon/technical.svg';
import settingsData from '../data/settings.json';

function Lesson({ lesson, data, onChange }) {
    const xPos = (lesson.x *45) + 50
    const yPos = lesson.y * 7 * settingsData.vertical_spacing
    const iconWidth = settingsData.icon_width * settingsData.icon_scale
    const iconMargin = (settingsData.icon_width - iconWidth) / 2
    return (
        <div className="bounding-box-lesson" style={{left: xPos+"vw", top: yPos+"vw"}}>
            <YourSvg fill="currentColor" className="lesson-icon" style={{width: iconWidth+"vw", margin: iconMargin+"vw"}}/>
        </div>
    )
}

//

export default Lesson;
