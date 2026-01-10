import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionAndAnswer from "./QuestionAndAnswer";
import ButtonBoard from "../components/ButtonBoard";
import { getIntervalName, getNoteName, isNoteWhite } from "../helpers/music";
import { mod } from "../helpers/misc";
import { useTheme } from "../helpers/theme";

const difficultyIntervals = {
    1: [2, 4, 5, 7],
    2: [2, 3, 4, 5, 7, 9, 11],
    3: [2, 3, 4, 5, 7, 8, 9, 10, 11],
    4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export default function IdentifyIntervalBetweenNotes() {
    const [difficulty, setDifficulty] = useState(1);
    const [questionState, setQuestionState] = useState(null);
    const { colorText } = useTheme();

    const generateQuestion = useCallback(() => {
        const availableIntervals = difficultyIntervals[difficulty];
        const interval =  availableIntervals[Math.floor(Math.random() *  availableIntervals.length)];
        const baseNote = Math.floor(Math.random() * 12);
        const otherNote = baseNote + interval;

        const isFlat = difficulty >= 2 && Math.random() < 0.5;

        // Reduce the chances of getting black-note intervals on lower difficulties
        if (!isNoteWhite(baseNote) || !isNoteWhite(otherNote)) {
            if (difficulty === 1 && Math.random() < 0.95) {
                return generateQuestion();
            }
            if (difficulty === 2 && Math.random() < 0.8) {
                return generateQuestion();
            }
            if (difficulty === 3 && Math.random() < 0.4) {
                return generateQuestion();
            }
        }

        const answerIntervals = [interval];
        while (answerIntervals.length < 4) {
            const otherInterval =  availableIntervals[Math.floor(Math.random() *  availableIntervals.length)];
            if (!(answerIntervals.includes(otherInterval))) {
                answerIntervals.push(otherInterval);
            }
        }
        answerIntervals.sort((a, b) => a - b);

        return {
            baseNote,
            interval,
            answerIntervals,
            otherNote,
            isFlat,
            submittedAnswer: null,
        }

    }, [difficulty]);

    const answers = questionState?.answerIntervals?.map((i) => {
        return ({ text: getIntervalName(i), value: i });
    });

    useEffect(() => {
        setQuestionState(generateQuestion());
    }, [difficulty])

    const onSubmit = useCallback((value) => {
        setQuestionState((prev) => ({ ...prev, submittedAnswer: value }));
    }, [questionState, setQuestionState]);

    const onNext = useCallback(() => {
        setQuestionState(generateQuestion());
    }, [generateQuestion, setQuestionState]);

    return (
            <QuestionAndAnswer
                difficulty={difficulty}
                onSetDifficulty={setDifficulty}
                maxDifficulty={4}
                onSubmit={onSubmit}
                onNext={onNext}
                submittedAnswer={questionState?.submittedAnswer}
                answers={answers}
                answerRows={2}
                answerWidth="260px"
                correctAnswer={questionState?.interval}
            >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2
                        style={{ color: colorText }}
                    >
                        What is the interval from {getNoteName(questionState?.baseNote, false, questionState?.isFlat)} to {getNoteName(questionState?.otherNote, false, questionState?.isFlat)}?
                    </h2>
                </div>
            </QuestionAndAnswer>
        );
};