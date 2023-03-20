import '../App.css';
import React from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';

function Lesson({ lesson, state, onSetPage }) {
    // Don't show at all if we're not close to unlocking it
    if (!state.threshold) {
        return <div/>
    }

    let xPos = (lesson.x *45) + 50
    let yPos = lesson.y * settingsData.icon_width * settingsData.vertical_spacing
    let iconWidth = settingsData.icon_width * settingsData.icon_scale
    let iconMargin = (settingsData.icon_width - iconWidth) / 2
    if (lesson.is_checkpoint) {
        iconWidth *= 0.3
        iconMargin *= 0.3
        yPos += iconWidth
    }

    let backgroundColor = settingsData.locked_color
    let backgroundColor2 = settingsData.locked_color
    if (state.unlocked) {
        backgroundColor = typeData[lesson.type].color
        backgroundColor2 = typeData[lesson.type].color
    }
    if (state.selectable) {
        backgroundColor2 = settingsData.hover_color
    }

    let iconImage = typeData[lesson.type].icon

    return (
        <div>
            <div className="bounding-box-lesson" onClick={state.selectable?onSetPage:null} style={{
                left: xPos+"vw",
                top: yPos+"vw",
                "--background-color": backgroundColor,
                "--background-color2": backgroundColor2,
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${iconImage}.png`}
                    fill="currentColor"
                    className="lesson-icon"
                    alt=""
                    style={{
                        width: iconWidth+"vw",
                        height: iconWidth+"vw",
                        margin: iconMargin+"vw"
                    }}
                />
            </div>
            {(state.completed && !lesson.is_checkpoint)?<img
                src={`${process.env.PUBLIC_URL}/icon/complete.png`}
                className="check-mark"
                alt=""
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
