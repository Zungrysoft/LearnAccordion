import '../App.css';
import React, {useState, useEffect} from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';

function Lesson({ lesson, state, onSetPage }) {
    // Don't show at all if we're no close to unlocking it
    if (!state.threshold) {
        return <div/>
    }

    const xPos = (lesson.x *45) + 50
    const yPos = lesson.y * settingsData.icon_width * settingsData.vertical_spacing
    const iconWidth = settingsData.icon_width * settingsData.icon_scale
    const iconMargin = (settingsData.icon_width - iconWidth) / 2

    let backgroundColor = settingsData.locked_color
    let backgroundColor2 = settingsData.locked_color
    if (state.unlocked) {
        backgroundColor = typeData[lesson.type].color
        backgroundColor2 = settingsData.hover_color
    }

    return (
        <div>
            <div className="bounding-box-lesson" onClick={state.unlocked?onSetPage:null} style={{
                left: xPos+"vw",
                top: yPos+"vw",
                "--background-color": backgroundColor,
                "--background-color2": backgroundColor2,
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
            {state.completed?<img
                src={`${process.env.PUBLIC_URL}/icon/complete.png`}
                className="check-mark"
                style={{
                    left: xPos+"vw",
                    top: yPos+"vw",
                    width: settingsData.icon_width+"vw",
                    height: settingsData.icon_width+"vw",
                }}
            />:<div/>}
        </div>
    )
}

export default Lesson;
