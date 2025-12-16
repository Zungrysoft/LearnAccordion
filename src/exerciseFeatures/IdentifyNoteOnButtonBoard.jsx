import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionAndAnswer from "./QuestionAndAnswer";
import ButtonBoard from "../components/ButtonBoard";
import { getNoteName } from "../helpers/music";
import { mod } from "../helpers/misc";

export default function IdentifyNoteOnButtonBoard() {
    const [difficulty, setDifficulty] = useState(1);
    const [questionState, setQuestionState] = useState(null);

    const generateQuestion = useCallback(() => {
        const radius = (difficulty * 5) - 2;
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

    const answers = [null, 1, 3, null, 6, 8, 10, null, 0, 2, 4, 5, 7, 9, 11].map((n) => {
        if (n == null) {
            return ({ text: "", value: null });
        }
        return ({ text: getNoteName(n, false, questionState?.isFlat), value: n });
    });

    useEffect(() => {
        setQuestionState(generateQuestion());
    }, [difficulty])

    const buttonBoardButtons = useMemo(() => {
        const ret = [];
        for (let i = 0; i < 17; i ++) {
            if (questionState?.hintNoteIndex === i) {
                ret.push({ text: getNoteName(questionState?.hintNote, false, questionState?.isFlat) })
            }
            else if (questionState?.questionNoteIndex === i) {
                ret.push({ icon: 'question' })
            }
            else {
                ret.push({});
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
            answers={answers}
            answerWidth="60px"
            answerRows={2}
            onSubmit={onSubmit}
            onNext={onNext}
            correctAnswer={questionState?.questionNote}
            submittedAnswer={questionState?.submittedAnswer}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ButtonBoard rows={3} heightPx={380} buttons={buttonBoardButtons} />
            </div>
        </QuestionAndAnswer>
    );
};