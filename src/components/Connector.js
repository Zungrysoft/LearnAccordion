import '../App.css';
import configData from '../data/config.json';
import { useIsMobile } from '../helpers/breakpoints';
import { useCallback } from 'react';
import { useTheme } from '../helpers/theme';
import { useLessonState } from '../context/LessonStateProvider';
import IconStar from './IconStar';

const LOCK_LINE_LENGTH = 100;

function curvePoint(p, bendiness) {
    return (Math.tanh((p - 0.5) * bendiness) * 0.5) + 0.5
}

function Connector({ lesson1, lesson2, state1, state2, bendiness, pointsRequired, flipPointsPosition, boardSize }) {
    const { colorConnector, colorConnectorCompleted } = useTheme();
    const { points } = useLessonState();
    const isMobile = useIsMobile();

    const v = useCallback((val) => {
        return `${(val / 100) * boardSize.width}px`
    }, [isMobile, boardSize, boardSize.width]);

    // Early out if width hasn't been set yet
    if (!boardSize.width) {
        return null;
    }

    // Don't draw if either of the lessons won't show up
    if (!state1 || !state1.threshold || !state2 || !state2.threshold) {
        return null;
    }

    // Draw in a different color if one of the lessons is completed
    const completedPrerequisites = state1.completed;
    const enoughPoints = points >= pointsRequired;
    let color1 = completedPrerequisites ? colorConnectorCompleted : colorConnector;
    let color2 = completedPrerequisites && enoughPoints ? colorConnectorCompleted : colorConnector;

    // Get positions of the two lessons
    let x1 = (lesson1.x * 45) + 50;
    let y1 = lesson1.y * configData.icon_width * configData.vertical_spacing + 1.5;
    let x2 = (lesson2.x * 45) + 50;
    let y2 = lesson2.y * configData.icon_width * configData.vertical_spacing + 1.5;
    const h = (configData.icon_width/2);

    // Special early exit case for if the line is completely vertical
    if (x1 === x2) {
        const size = Math.abs(y1-y2);
        const lockLineHeight = lesson2.is_connector ? 1.0 : 0.5;
        const textPos = [
            flipPointsPosition ? x1 - 1.5 : x1 + 1.5,
            Math.min(y1, y2) + (Math.abs(y1 - y2) * lockLineHeight) + h,
        ];
        const llhp = `${(lockLineHeight * 100) - (size / 50)}%`;
        return (
            <>
                <svg style={{
                    zIndex: 3,
                    position: "absolute",
                    width: v(size),
                    height: v(size),
                    left: isMobile ? Math.min(y1, y2)+h+v(isMobile) : v(x1-(size/2)),
                    top: isMobile ? 100-x1-(size/2)+v(isMobile) : v(Math.min(y1, y2)+h),
                    transform: isMobile ? 'rotate(90deg) translate(25%, 25%)' : '',
                }}>
                    <line x1="50%" y1="0%" x2="50%" y2={llhp} stroke={color1} strokeWidth="2" />
                    <line x1="50%" y1={llhp} x2="50%" y2="100%" stroke={color2} strokeWidth="2" />
                    {pointsRequired > 0 && (
                        <line
                            x1={`${50 - (LOCK_LINE_LENGTH / size)}%`}
                            y1={llhp}
                            x2={`${50 + (LOCK_LINE_LENGTH / size)}%`}
                            y2={llhp}
                            stroke={color2}
                            strokeWidth="2"
                        />
                    )}
                </svg>
                {pointsRequired > 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'start',
                        gap: '4px',
                        position: "absolute",
                        left: v(textPos[0]),
                        top: v(textPos[1]),
                        transform: flipPointsPosition ? "translate(-100%, -50%)" : "translate(0%, -50%)",
                    }}>
                        <h2 style={{ color: enoughPoints ? colorConnectorCompleted : colorConnector, fontSize: 14, margin: 0}}>{pointsRequired}</h2>
                        <IconStar width={14} color={enoughPoints ? colorConnectorCompleted : colorConnector} />
                    </div>
                )}
            </>
        )
    }

    // Swap axes on mobile so progression is left to right
    if (isMobile) {
        [x1, y1] = [y1, 100 - x1];
        [x2, y2] = [y2, 100 - x2];
    }

    // Determine if the line will need to be flipped
    let flip = false
    if (x1 > x2) {flip = !flip}
    if (y1 > y2) {flip = !flip}

    // Calculate lines
    const seg = configData.connector_segments
    let lines = []
    for (let i = 0; i < seg; i ++) {
        let yf1 = i/seg
        let yf2 = (i+1)/seg
        let xf1 = curvePoint(yf1, configData.connector_bendiness * (bendiness ?? 1))
        let xf2 = curvePoint(yf2, configData.connector_bendiness * (bendiness ?? 1))
        if (flip) {
            xf1 = 1-xf1
            xf2 = 1-xf2
        }
        if (isMobile) {
            [xf1, yf1] = [yf1, xf1];
            [xf2, yf2] = [yf2, xf2];
        }
        lines.push({
            x1: xf1,
            x2: xf2,
            y1: yf1,
            y2: yf2,
            secondHalf: i >= seg/2,
        })
    }

    // Calculate lock line params
    const line1 = lines[Math.floor(lines.length / 2) + 0];
    const line2 = lines[Math.floor(lines.length / 2) + 1];
    const deltaVector = [
        (line2.y2 - line1.y1) * Math.abs(y1-y2),
        (line2.x2 - line1.x1) * Math.abs(x1-x2) * -1,
    ];
    const len = Math.sqrt(deltaVector[0]**2 + deltaVector[1]**2);
    const dirVectorOrientation = (x1-x2 < 0) !== (y1-y2 < 0) ? -1 : 1;
    const dirVectorFlip = flipPointsPosition ? -1 : 1;
    const dirVector = [
        (deltaVector[0] / len) * dirVectorOrientation * dirVectorFlip,
        (deltaVector[1] / len) * dirVectorOrientation * dirVectorFlip,
    ];
    const pos = [
        line1.x2 * 100,
        line1.y2 * 100,
    ];
    const dirVectorInSvg = [
        dirVector[0] * LOCK_LINE_LENGTH / Math.abs(x1-x2),
        dirVector[1] * LOCK_LINE_LENGTH / Math.abs(y1-y2),
    ]
    const endPosX1 = pos[0] - dirVectorInSvg[0];
    const endPosX2 = pos[0] + dirVectorInSvg[0];
    const endPosY1 = pos[1] - dirVectorInSvg[1];
    const endPosY2 = pos[1] + dirVectorInSvg[1];

    const textPos = [
        Math.min(x1, x2) + (pos[0]/100 * Math.abs(x1-x2)) + (dirVector[0] * 3),
        Math.min(y1, y2) + (pos[1]/100 * Math.abs(y1-y2) + h) + (dirVector[1] * 3),
    ];

    return (
        <>
            <svg key={boardSize.width} style={{
                zIndex: 3,
                position: "absolute",
                width: v(Math.abs(x1-x2)),
                height: v(Math.abs(y1-y2)),
                left: v(Math.min(x1, x2)),
                top: v(Math.min(y1, y2)+h),
            }}>
                {lines.map((l, idx) => (
                    <line
                        key={idx}
                        x1={l.x1*100+"%"}
                        y1={l.y1*100+"%"}
                        x2={l.x2*100+"%"}
                        y2={l.y2*100+"%"}
                        stroke={l.secondHalf ? color2 : color1}
                        strokeWidth="2"
                    />
                ))}
                {pointsRequired > 0 && (
                    <line
                        x1={`${endPosX1}%`}
                        y1={`${endPosY1}%`}
                        x2={`${endPosX2}%`}
                        y2={`${endPosY2}%`}
                        stroke={color2}
                        strokeWidth="2"
                    />
                )}
            </svg>
            {pointsRequired > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'start',
                    gap: '4px',
                    position: "absolute",
                    left: v(textPos[0]),
                    top: v(textPos[1]),
                    transform: flipPointsPosition ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
                }}>
                    <h2 style={{ color: enoughPoints ? colorConnectorCompleted : colorConnector, fontSize: 14, margin: 0}}>{pointsRequired}</h2>
                    <IconStar width={14} color={enoughPoints ? colorConnectorCompleted : colorConnector} />
                </div>
            )}
        </>
    )
}

export default Connector;
