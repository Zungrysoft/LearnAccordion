import '../App.css';
import settingsData from '../data/settings.json';
import lessonData from '../data/settings.json';
import { BezierCurveEditor } from 'react-bezier-curve-editor';
import { useIsMobile } from '../helpers/breakpoints';

function curvePoint(p) {
    return (Math.tanh((p - 0.5) * settingsData.connector_bendiness) * 0.5) + 0.5
}

function v(isMobile) {
    return isMobile ? 'vh' : 'vw';
}

function Connector({ lesson1, lesson2, state1, state2 }) {
    const isMobile = useIsMobile();

    // Don't draw if either of the lessons won't show up
    if (!state1 || !state1.threshold || !state2 || !state2.threshold) {
        return <div/>
    }

    // Draw in a different color if one of the lessons is completed
    let color = settingsData.connector_color
    if (state1.completed) {
        color = settingsData.connector_color_completed
    }

    // Get positions of the two lessons
    let x1 = (lesson1.x *45) + 50
    let y1 = lesson1.y * settingsData.icon_width * settingsData.vertical_spacing
    let x2 = (lesson2.x *45) + 50
    let y2 = lesson2.y * settingsData.icon_width * settingsData.vertical_spacing
    const h = (settingsData.icon_width/2)

    // Special early exit case for if the line is completely vertical
    if (x1 === x2) {
        const size = Math.abs(y1-y2);
        return (
            <svg style={{
                zIndex: -1,
                position: "absolute",
                width: size+v(isMobile),
                height: size+v(isMobile),
                left: isMobile ? Math.min(y1, y2)+h+v(isMobile) : x1-(size/2)+v(isMobile),
                top: isMobile ? 100-x1-(size/2)+v(isMobile) : Math.min(y1, y2)+h+v(isMobile),
                transform: isMobile ? 'rotate(90deg) translate(25%, 25%)' : '',
            }}>
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke={color} strokeWidth="2" />
            </svg>
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
    const seg = settingsData.connector_segments
    let lines = []
    for (let i = 0; i < seg; i ++) {
        let yf1 = i/seg
        let yf2 = (i+1)/seg
        let xf1 = curvePoint(yf1)
        let xf2 = curvePoint(yf2)
        if (flip) {
            xf1 = 1-xf1
            xf2 = 1-xf2
        }
        if (isMobile) {
            [xf1, yf1] = [yf1, xf1];
            [xf2, yf2] = [yf2, xf2];
        }
        lines.push({
            x1: xf1*100+"%",
            x2: xf2*100+"%",
            y1: yf1*100+"%",
            y2: yf2*100+"%",
        })
    }

    return (
        <div>
            {lines.map((l, idx) => (
                <svg key={idx} style={{
                    zIndex: -1,
                    position: "absolute",
                    width: Math.abs(x1-x2)+v(isMobile),
                    height: Math.abs(y1-y2)+v(isMobile),
                    left: Math.min(x1, x2)+v(isMobile),
                    top: Math.min(y1, y2)+h+v(isMobile),
                }}>
                    <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="2" />
                </svg>
            ))}
        </div>
    )
}


// width: Math.abs(x1-x2)+"vw",
// height: Math.abs(y1-y2)+"vw"

export default Connector;
