import '../App.css';
import React, {useState, useEffect} from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';

function Lesson({ lesson, data, onChange, onSetPage }) {
    const xPos = (lesson.x *45) + 50
    const yPos = lesson.y * settingsData.icon_width * settingsData.vertical_spacing
    const iconWidth = settingsData.icon_width * settingsData.icon_scale
    const iconMargin = (settingsData.icon_width - iconWidth) / 2

    let backgroundColor = settingsData.locked_color
    // if (data && data.unlocked == true) {
        backgroundColor = typeData[lesson.type].color
    // }

    return (
        <div className="bounding-box-lesson" onClick={onSetPage} style={{
            left: xPos+"vw",
            top: yPos+"vw",
            "--background-color": backgroundColor,
            "--background-color2": settingsData.hover_color,
        }}>
            <img
                src={`${process.env.PUBLIC_URL}/icon/${typeData[lesson.type].icon}.png`}
                fill="currentColor"
                className="lesson-icon"
                style={{
                    width: iconWidth+"vw",
                    height: iconWidth+"vw",
                    margin: iconMargin+"vw"
                }}
            />
        </div>
    )
}

export default Lesson;
