import '../App.css';
import React, { useCallback } from 'react';
import configData from '../data/config.json';
import typeData from '../data/types.json';
import { useIsMobile } from '../helpers/breakpoints';
import { useTheme } from '../helpers/theme';

function Lesson({ lesson, state, onSetPage, boardSize }) {
    const isMobile = useIsMobile();
    const { colorLockedLesson, colorConnector, colorConnectorCompleted } = useTheme();

    const vwToPx = useCallback((vw) => {
        return `${(vw / 100) * boardSize.width}px`;
    }, [boardSize.width]) 

    // Don't show at all if we're not close to unlocking it
    if (!state.threshold) {
        return null;
    }

    let xPos = (lesson.x *45) + 50
    let yPos = lesson.y * configData.icon_width * configData.vertical_spacing + (configData.icon_width/2) + 1.5
    let iconWidth = configData.icon_width * configData.icon_scale
    let iconMargin = (configData.icon_width - iconWidth) / 2
    if (lesson.is_connector) {
        iconWidth *= 0.3
        iconMargin *= 0.3
    }

    let backgroundColor = colorLockedLesson
    let backgroundColor2 = colorLockedLesson
    if (state.unlocked) {
        backgroundColor = typeData[lesson.type].color
        backgroundColor2 = typeData[lesson.type].color
    }
    if (state.selectable) {
        backgroundColor2 = colorConnectorCompleted
    }

    let iconImage = typeData[lesson.type].icon

    // if (lesson.is_connector) {
    //     return (
    //         <div
    //             style={{
    //                 position: 'absolute',
    //                 zIndex: 4,
    //                 left: isMobile ? yPos+"vh" : vwToPx(xPos),
    //                 top: isMobile ? (100-xPos)+"vh" : vwToPx(yPos),
    //                 transform: 'translate(-50%, -50%)'
    //             }}
    //         >
    //             <IconDiamond
    //                 width={(1.1 / 100) * boardSize.width}
    //                 color={state.unlocked ? colorConnectorCompleted : colorConnector}
    //             />
    //         </div>
    //     );
    // }

    // Early out if width hasn't been set yet
    if (!boardSize.width) {
        return null;
    }

    if (lesson.is_connector) {
        return null;
    }

    return (
        <>
            <div
                className="bounding-box-lesson"
                onClick={state.selectable?onSetPage:null}
                style={{
                    left: isMobile ? yPos+"vh" : `calc(${vwToPx(xPos)} - 2px)`,
                    top: isMobile ? (100-xPos)+"vh" : `calc(${vwToPx(yPos)} - 2px)`,
                    zIndex: 4,
                    outline: state.unlocked && !state.completed ? `${colorConnectorCompleted} solid 6px` : null,
                    borderStyle: state.selectable ? "solid" : "dashed",
                    "--background-color": backgroundColor,
                    "--background-color2": backgroundColor2,
                }}
            >
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
            {state.completed && (
                <img
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
                />
            )}
        </>
    )
}

export default Lesson;
