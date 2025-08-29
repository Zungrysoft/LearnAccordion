import '../App.css';
import React, { useState } from 'react';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';
import LessonSubtask from './LessonSubtask';

function LessonPage({ lesson, completionState, onChangeCompleted, onChangeSubtask, onClose, isOpen }) {
    const [openSubtask, setOpenSubtask] = useState(null);

    if (!lesson) {
        return <div/>
    }

    const completedSubtasks = Object.values(completionState?.subtasks ?? {}).filter((x) => x).length;
    const requiredSubtasks = lesson.subtasks_required;
    let subtaskCompletionText = `Lesson Complete!`;
    if (completedSubtasks < requiredSubtasks) {
        const moreNeeded = requiredSubtasks - completedSubtasks;
        subtaskCompletionText = `Learn ${completedSubtasks > 0 ? '' : 'any'} ${moreNeeded} ${completedSubtasks > 0 ? 'more' : ''} song${moreNeeded === 1 ? '' : 's'} to advance`;
    }

    return (
        <div className={isOpen?"backdrop":"backdrop-none"}>
            <div
                className="bounding-box-page"
                style={{
                    "--background-color": typeData[lesson.type].color,
                    top: isOpen?"2vh":"105vh",
                    overflowY: 'auto',
                }}
                
            >
                <button className="page-close" onClick={onClose}>X</button>
                <h2>{typeData[lesson.type].title}</h2>
                <h4>{lesson.title}</h4>
                {lesson.subtasks && <h2>{subtaskCompletionText}</h2>}
                <Embed url={lesson.video_url}/>
                <p>{lesson.description}</p>
                {lesson.subtasks && (
                    <div style={{ width: "auto", padding: "16px", height: 'auto' }}>
                        {
                            Object.keys(lesson.subtasks).map((subtaskKey) => {
                                const subtask = lesson.subtasks[subtaskKey];

                                return <LessonSubtask
                                    lesson={lesson}
                                    subtask={subtask}
                                    subtaskKey={subtaskKey}
                                    toggleCompletion={(newState) => onChangeSubtask(subtaskKey, newState)}
                                    onClickTitle={() => setOpenSubtask((prev) => {return prev === subtaskKey ? null : subtaskKey})}
                                    isOpen={openSubtask === subtaskKey}
                                    completed={completionState?.subtasks?.[subtaskKey]}
                                />;
                            })
                        }
                    </div>
                )}
                {!lesson.subtasks && (
                    <CheckBox text="Mark as completed:" onChange={onChangeCompleted} checked={completionState?.completed}/>
                )}
                

            </div>
        </div>
    )
}

export default LessonPage;
