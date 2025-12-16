import { useTheme } from "../helpers/theme";

export default function ButtonBoard({ rows = 3, columns = 5, buttons, onClick = () => {}, widthPx, heightPx }) {
    const heightToWidthRatio = (columns + 1) / (rows / 1.155);

    let widthPxCalc = widthPx;
    let heightPxCalc = heightPx ?? 200;
    if (heightPxCalc) {
        widthPxCalc = heightPxCalc / heightToWidthRatio;
    }
    else if (widthPxCalc) {
        heightPxCalc = widthPxCalc * heightToWidthRatio;
    }

    const rowSpacingPx = (widthPxCalc / rows);
    const columnSpacingPx = rowSpacingPx * 1.155;
    const buttonRadiusPx = columnSpacingPx * 0.95;

    return (
        <div style={{ width: `${widthPxCalc}px`, height: `${heightPxCalc}px`, position: 'relative' }}>
            {[...Array(rows)].map((_, i) => {
                const buttonsInRow = i % 2 === 0 ? columns : columns + 1;
                const x = i * rowSpacingPx;

                return [...Array(buttonsInRow)].map((_, j) => {
                    const y = j * columnSpacingPx + (i % 2 === 0 ? columnSpacingPx / 2 : 0);
                    const startingIndices = [3, 1, 2, 0, 1];
                    const buttonIndex = startingIndices[i] + j * 3;

                    return (
                        <BoardButton
                            text={buttons[buttonIndex]?.text}
                            icon={buttons[buttonIndex]?.icon}
                            onClick={buttons[buttonIndex]?.onClick}
                            backgroundColor={buttons[buttonIndex]?.backgroundColor}
                            x={x}
                            y={y}
                            radiusPx={buttonRadiusPx}
                        />
                    );
                });
            })}
        </div>
    );
}

function BoardButton({ onClick, text, icon, radiusPx, x, y, backgroundColor }) {

    let contents = null;
    if (icon) {
        contents = (
            <img
                src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
                alt=""
                style={{
                    width: `${radiusPx * 0.6}px`,
                    height: `${radiusPx * 0.6}px`,
                }}
            />
        );
    }
    else if (text) {
        contents = (
            <h2 style={{ fontSize: `${radiusPx * 0.5}px` }}>{text}</h2>
        );
    };

    return (
        <button
            style={{
                border: `2px solid black`,
                borderRadius: '50%',
                position: 'absolute',
                right: `${x}px`,
                bottom: `${y}px`,
                width: `${radiusPx}px`,
                height: `${radiusPx}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: onClick ? 'pointer' : undefined,
                backgroundColor: backgroundColor ?? 'white',
            }}
            onClick={onClick ? onClick : undefined}
        >
            {contents}
        </button>
    );
}
