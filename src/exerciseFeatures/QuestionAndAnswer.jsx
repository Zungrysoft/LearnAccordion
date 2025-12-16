import { useCallback } from "react";
import BasicButton from "../components/BasicButton";
import { useTheme } from "../helpers/theme";

export default function QuestionAndAnswer({
    children,
    answers = [],
    answerWidth = "120px",
    answerHeight = "48px",
    answerRows = 1,
    correctAnswer,
    submittedAnswer,
    difficulty,
    maxDifficulty = 5,
    onSetDifficulty,
    onSubmit,
    onNext,
}) {
    const { colorText } = useTheme();

    const answersPerRow = Math.ceil(answers.length / answerRows);

    const getAnswerColor = useCallback((buttonAnswer) => {
        if (correctAnswer === submittedAnswer) {
            if (buttonAnswer === submittedAnswer) {
                return '#29cf5e';
            }
        }
        else if (submittedAnswer != null && correctAnswer !== submittedAnswer) {
            if (buttonAnswer === correctAnswer) {
                return '#cc4729';
            }
        }

        return undefined;
    }, [correctAnswer, submittedAnswer]);

    return (
        <>
            {children}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                    {[...Array(answerRows)].map((_, i) => (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            {answers.slice(i * answersPerRow, (i + 1) * answersPerRow).map((answer) => 
                                answer.value == null ? (
                                    <div style={{ width: answerWidth, height: answerHeight }} />
                                ) : (
                                    <BasicButton
                                        text={answer.text}
                                        onClick={() => {onSubmit(answer.value)}}
                                        width={answerWidth}
                                        height={answerHeight}
                                        backgroundColor={getAnswerColor(answer.value)}
                                        disabled={submittedAnswer != null && !getAnswerColor(answer.value)}
                                        unclickable={submittedAnswer != null}
                                        border
                                    />
                                )
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "32px" }}>
                    {!!difficulty && !!onSetDifficulty && (
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
                            <h2 style={{ fontSize: "14px", color: colorText, width: '80px' }}>Difficulty {difficulty.toFixed(0)}</h2>
                            <input
                                type="range"
                                min={1}
                                max={maxDifficulty}
                                step={1}
                                value={difficulty}
                                onChange={(e) => onSetDifficulty(Number(e.target.value))}
                                style={{ width: "150px", marginTop: "4px" }}
                            />
                        </div>
                    )}
                    <BasicButton text="Next" width="100px" disabled={submittedAnswer == null} onClick={onNext} border/>
                </div>
            </div>
        </>
    );
};