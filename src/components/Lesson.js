import '../App.css';
import React, { useCallback } from 'react';
import configData from '../data/config.json';
import typeData from '../data/types.json';
import { useIsMobile } from '../helpers/breakpoints';

function Lesson({ lesson, state, onSetPage, boardSize }) {
    const isMobile = useIsMobile();

    const vwToPx = useCallback((vw) => {
        return `${(vw / 100) * boardSize.width}px`;
    }, [boardSize.width]) 

    // Don't show at all if we're not close to unlocking it
    if (!state.threshold) {
        return <div/>
    }

    let xPos = (lesson.x *45) + 50
    let yPos = lesson.y * configData.icon_width * configData.vertical_spacing + 1.5
    let iconWidth = configData.icon_width * configData.icon_scale
    let iconMargin = (configData.icon_width - iconWidth) / 2
    if (lesson.is_connector) {
        iconWidth *= 0.3
        iconMargin *= 0.3
        yPos += iconWidth
    }

    let backgroundColor = configData.locked_color
    let backgroundColor2 = configData.locked_color
    if (state.unlocked) {
        backgroundColor = typeData[lesson.type].color
        backgroundColor2 = typeData[lesson.type].color
    }
    if (state.selectable) {
        backgroundColor2 = configData.hover_color
    }

    let iconImage = typeData[lesson.type].icon

    return (
        <>
            <div className="bounding-box-lesson" onClick={state.selectable?onSetPage:null} style={{
                left: isMobile ? yPos+"vh" : vwToPx(xPos),
                top: isMobile ? (100-xPos)+"vh" : vwToPx(yPos),
                zIndex: 4,
                "--background-color": backgroundColor,
                "--background-color2": backgroundColor2,
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${iconImage}.png`}
                    fill="currentColor"
                    className="lesson-icon"
                    alt=""
                    style={{
                        width: isMobile ? iconWidth+"vh" : vwToPx(iconWidth),
                        height: isMobile ? iconWidth+"vh" : vwToPx(iconWidth),
                        margin: vwToPx(iconMargin),
                    }}
                />
            </div>
            {(state.completed && !lesson.is_connector)?<img
                src={`${process.env.PUBLIC_URL}/icon/complete.png`}
                className="check-mark"
                alt=""
                style={{
                    zIndex: 5,
                    left: isMobile ? yPos+"vh" :  vwToPx(xPos),
                    top: isMobile ? (100-xPos)+"vh" : vwToPx(yPos),
                    width: isMobile ? configData.icon_width+"vh" :  vwToPx(configData.icon_width),
                    height: isMobile ? configData.icon_width+"vh" :  vwToPx(configData.icon_width),
                }}
            />:<div/>}
        </>
    )
}

export default Lesson;
