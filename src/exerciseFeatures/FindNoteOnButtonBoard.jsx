import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionAndAnswer from "./QuestionAndAnswer";
import ButtonBoard from "../components/ButtonBoard";
import { getNoteName } from "../helpers/music";
import { mod } from "../helpers/misc";

export default function FindNoteOnButtonBoard() {
    const [difficulty, setDifficulty] = useState(1);
    const [questionState, setQuestionState] = useState(null);

    const generateQuestion = useCallback(() => {
        const radius = (difficulty * 4) - 1;
        const hintNoteIndex = 1 + Math.floor(Math.random() * 16);

        let questionNoteIndex = null;
        do {
            const offset = Math.ceil(Math.random() * radius) * (Math.random() < 0.5 ? 1 : -1);
            questionNoteIndex = hintNoteIndex + offset;
        } while (questionNoteIndex === hintNoteIndex || questionNoteIndex <= 0 || questionNoteIndex >= 17);

        const hintNote = Math.floor(Math.random() * 12);
        const questionNote = mod(hintNote + (questionNoteIndex - hintNoteIndex), 12);

        const isFlat = difficulty >= 2 && Math.random() < 0.5;

        return {
            hintNote,
            hintNoteIndex,
            questionNote,
            questionNoteIndex,
            isFlat,
            submittedAnswer: null,
        }

    }, [setQuestionState, difficulty]);

    useEffect(() => {
        setQuestionState(generateQuestion());
    }, [difficulty])

    const buttonBoardButtons = useMemo(() => {
        const ret = [];
        for (let i = 0; i < 17; i ++) {
            if (questionState?.hintNoteIndex === i) {
                ret.push({ text: getNoteName(questionState?.hintNote, false, questionState?.isFlat) })
            }
            else {
                const buttonData = {
                    text: questionState?.submittedAnswer ? getNoteName(mod(i + (questionState?.questionNote - questionState?.questionNoteIndex), 12), false, questionState?.isFlat) : '',
                    opacity: 0.2,
                };
                if (questionState?.submittedAnswer == null) {
                    buttonData.onClick = () => onSubmit(i);
                }
                else {
                    if (i === questionState?.questionNoteIndex) {
                        const correct = questionState?.submittedAnswer === questionState?.questionNoteIndex;
                        buttonData.backgroundColor = correct ? '#29cf5e' : '#cc4729';
                        buttonData.text = getNoteName(questionState?.questionNote, false, questionState?.isFlat);
                        buttonData.opacity = 1.0;
                    }
                }

                ret.push(buttonData);
            }
        }
        return ret;
    }, [questionState]);

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
            maxDifficulty={3}
            onSubmit={onSubmit}
            onNext={onNext}
            submittedAnswer={questionState?.submittedAnswer}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ButtonBoard rows={3} heightPx={380} buttons={buttonBoardButtons} />
                <h2>Find note {getNoteName(questionState?.questionNote, false, questionState?.isFlat)} {questionState?.questionNoteIndex > questionState?.hintNoteIndex ? 'above' : 'below'}</h2>
            </div>
        </QuestionAndAnswer>
    );
};