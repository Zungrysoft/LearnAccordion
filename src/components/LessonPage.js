import '../App.css';
import React, { useState } from 'react';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';

function GenreIndicator({ genre }) {
    if (!genre) {
        return null;
    }

    let genreIcon = null;
    if (['rock', 'metal', 'alternative'].includes(genre.toLowerCase())) {
        genreIcon = 'guitar';
    }
    else if (['classical', 'orchestra', 'soundtrack'].includes(genre.toLowerCase())) {
        genreIcon = 'piano2'
    }
    else if (['folk'].includes(genre.toLowerCase())) {
        genreIcon = 'clap'
    }
    else if (['pop'].includes(genre.toLowerCase())) {
        genreIcon = 'microphone'
    }
    else if (['jazz'].includes(genre.toLowerCase())) {
        genreIcon = 'saxophone'
    }
    else if (['zydeco'].includes(genre.toLowerCase())) {
        genreIcon = 'washboard'
    }
    else if (['polka'].includes(genre.toLowerCase())) {
        genreIcon = 'accordion'
    }
    else if (['sea shanty'].includes(genre.toLowerCase())) {
        genreIcon = 'anchor'
    }
    else if (['latin'].includes(genre.toLowerCase())) {
        genreIcon = 'maracas'
    }
    else if (['video game music'].includes(genre.toLowerCase())) {
        genreIcon = 'controller'
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 'normal', fontStyle: 'italic' }}>{genre}</h2>
            {genreIcon && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${genreIcon}.png`}
                    alt=""
                    style={{
                        width: '48px',
                        height: '48px',
                    }}
                />
            )}
        </div>
    );
}

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
                }}
            >
                <button className="page-close" onClick={onClose}>X</button>
                <h2>{typeData[lesson.type].title}</h2>
                <h4>{lesson.title}</h4>
                {lesson.subtasks && <h2>{subtaskCompletionText}</h2>}
                <Embed url={lesson.video_url}/>
                <p>{lesson.description}</p>
                {lesson.subtasks && (
                    <div style={{ width: "auto", padding: "16px" }}>
                        {
                            Object.keys(lesson.subtasks).map((subtaskKey) => {
                                const subtask = lesson.subtasks[subtaskKey];

                                return (
                                    <div
                                        key={subtaskKey}
                                        style={{
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <button
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                border: "solid",
                                                backgroundColor: typeData[lesson.type].color2,
                                                borderRadius: openSubtask === subtaskKey ? "8px 8px 0 0" : "8px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setOpenSubtask((prev) => {return prev === subtaskKey ? null : subtaskKey})}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
                                                <h2 style={{ textDecoration: completionState.subtasks?.[subtaskKey] ? 'line-through' : 'none' }}>
                                                    {subtask.title}
                                                </h2>
                                                <GenreIndicator genre={subtask.genre} />
                                            </div>
                                        </button>
                                        {openSubtask === subtaskKey && (
                                            <div
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: typeData[lesson.type].color2,
                                                    borderRadius: "0 0 8px 8px",
                                                }}
                                            >
                                                {subtask.artist && <p>{`by ${subtask.artist}`}</p>}
                                                <p>{subtask.description}</p>
                                                <Embed url={subtask.video_url}/>
                                                <CheckBox
                                                    text="Mark as completed:"
                                                    onChange={(newState) => onChangeSubtask(subtaskKey, newState)}
                                                    checked={completionState?.subtasks?.[subtaskKey]}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
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
