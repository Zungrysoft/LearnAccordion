import '../App.css';
import React, {useState, useEffect} from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';

function Lesson({ lesson, data, onChange }) {
    const xPos = (lesson.x *45) + 50
    const yPos = lesson.y * 7 * settingsData.vertical_spacing
    const iconWidth = settingsData.icon_width * settingsData.icon_scale
    const iconMargin = (settingsData.icon_width - iconWidth) / 2

    return (
        <div className="bounding-box-lesson" style={{left: xPos+"vw", top: yPos+"vw"}}>
            <img
                src={`${process.env.PUBLIC_URL}/icon/${typeData[lesson.type].icon}.png`}
                fill="currentColor"
                className="lesson-icon"
                style={{
                    width: iconWidth+"vw",
                    margin: iconMargin+"vw"
                }}
            />
        </div>
    )
}

//

export default Lesson;
