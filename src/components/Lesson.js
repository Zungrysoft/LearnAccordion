import '../App.css';
import React from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';
import { useIsMobile } from '../helpers/breakpoints';

function Lesson({ lesson, state, onSetPage }) {
    const isMobile = useIsMobile();

    // Don't show at all if we're not close to unlocking it
    if (!state.threshold) {
        return <div/>
    }

    let xPos = (lesson.x *45) + 50
    let yPos = lesson.y * settingsData.icon_width * settingsData.vertical_spacing + 1.5
    let iconWidth = settingsData.icon_width * settingsData.icon_scale
    let iconMargin = (settingsData.icon_width - iconWidth) / 2
    if (lesson.is_connector) {
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
                left: isMobile ? yPos+"vh" : xPos+"vw",
                top: isMobile ? (100-xPos)+"vh" : yPos+"vw",
                "--background-color": backgroundColor,
                "--background-color2": backgroundColor2,
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${iconImage}.png`}
                    fill="currentColor"
                    className="lesson-icon"
                    alt=""
                    style={{
                        width: isMobile ? iconWidth+"vh" : iconWidth+"vw",
                        height: isMobile ? iconWidth+"vh" : iconWidth+"vw",
                        margin: iconMargin+"vw",
                    }}
                />
            </div>
            {(state.completed && !lesson.is_connector)?<img
                src={`${process.env.PUBLIC_URL}/icon/complete.png`}
                className="check-mark"
                alt=""
                style={{
                    left: isMobile ? yPos+"vh" : xPos+"vw",
                    top: isMobile ? (100-xPos)+"vh" : yPos+"vw",
                    width: isMobile ? settingsData.icon_width+"vh" : settingsData.icon_width+"vw",
                    height: isMobile ? settingsData.icon_width+"vh" : settingsData.icon_width+"vw",
                }}
            />:<div/>}
        </div>
    )
}

export default Lesson;
