import '../App.css';
import settingsData from '../data/settings.json';
import lessonData from '../data/settings.json';

function curvePoint(p) {
    return (Math.tanh((p - 0.5) * settingsData.connector_bendiness) * 0.5) + 0.5
}

function Connector({ lesson1, lesson2 }) {
    // Get positions of the two lessons
    const x1 = (lesson1.x *45) + 50
    const y1 = lesson1.y * settingsData.icon_width * settingsData.vertical_spacing
    const x2 = (lesson2.x *45) + 50
    const y2 = lesson2.y * settingsData.icon_width * settingsData.vertical_spacing
    const h = (settingsData.icon_width/2)

    // Special early exit case for if the line is completely vertical
    if (x1 == x2) {
        return (
            <svg style={{
                zIndex: -1,
                position: "absolute",
                width: "1vw",
                height: Math.abs(y1-y2)+"vw",
                left: x1+"vw",
                top: Math.min(y1, y2)+h+"vw",
                transform: "translate(-50%, 0%)",
            }}>
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="black" strokeWidth="2" />
            </svg>
        )
    }

    // Determine if the line will need to be flipped
    let flip = false
    if (x1 > x2) {flip = !flip}
    if (y1 > y2) {flip = !flip}

    // Calculate lines
    const seg = settingsData.connector_segments
    let lines = []
    for (let i = 0; i < seg; i ++) {
        const yf1 = i/seg
        const yf2 = (i+1)/seg
        let xf1 = curvePoint(yf1)
        let xf2 = curvePoint(yf2)
        if (flip) {
            xf1 = 1-xf1
            xf2 = 1-xf2
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
            {lines.map((l) => (
                <svg style={{
                    zIndex: -1,
                    position: "absolute",
                    width: Math.abs(x1-x2)+"vw",
                    height: Math.abs(y1-y2)+"vw",
                    left: Math.min(x1, x2)+"vw",
                    top: Math.min(y1, y2)+h+"vw",
                }}>
                    <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="black" strokeWidth="2" />
                </svg>
            ))}
        </div>
    )
}

// width: Math.abs(x1-x2)+"vw",
// height: Math.abs(y1-y2)+"vw"

export default Connector;
