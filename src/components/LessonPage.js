import '../App.css';
import React, { useMemo, useState } from 'react';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';
import LessonSubtask from './LessonSubtask';
import genreData from '../data/genres.json';

function sortLessonSubtasksCompareEntry(a, b, sortOrderEntry) {
    if (sortOrderEntry === 'genre') {
        return (genreData[a.genre].priority ?? Infinity) - (genreData[b.genre].priority ?? Infinity);
    }
    else if (sortOrderEntry === 'difficulty') {
        return (a.difficulty ?? 0) - (b.difficulty ?? 0);
    }
    else if (sortOrderEntry === 'title') {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    }
    else if (sortOrderEntry === 'artist') {
        if (a.artist < b.artist) {
            return -1;
        }
        if (a.artist > b.artist) {
            return 1;
        }
        return 0;
    }
    return 0;
}

function sortLessonSubtasksCompare(a, b, sortOrder) {
    for (const sortOrderEntry of sortOrder) {
        const res = sortLessonSubtasksCompareEntry(a, b, sortOrderEntry);
        if (res) {
            return res;
        }
    }
}

function sortLessonSubtasksGenre(a, b) {
    return sortLessonSubtasksCompare(a, b, ['genre', 'difficulty', 'artist', 'title'])
}

function sortLessonSubtasksDifficulty(a, b) {
    return sortLessonSubtasksCompare(a, b, ['difficulty', 'genre', 'artist', 'title'])
}

function sortLessonSubtasksTitle(a, b) {
    return sortLessonSubtasksCompare(a, b, ['title', 'artist'])
}

function sortLessonSubtasksArtist(a, b) {
    return sortLessonSubtasksCompare(a, b, ['artist', 'title'])
}

function getSortModeFunc(sortMode) {
    if (sortMode === 1) {
        return sortLessonSubtasksDifficulty;
    }
    if (sortMode === 2) {
        return sortLessonSubtasksArtist;
    }
    if (sortMode === 3) {
        return sortLessonSubtasksTitle;
    }
    return sortLessonSubtasksGenre;
}

function getSortModeDisplay(sortMode) {
    if (sortMode === 1) {
        return 'Difficulty';
    }
    if (sortMode === 2) {
        return 'Artist/Origin';
    }
    if (sortMode === 3) {
        return 'Title';
    }
    return 'Genre';
}

function sortLessonSubtasks(subtasks, sortMode) {
    if (!subtasks) {
        return [];
    }

    const sortedSubtasks = Object.keys(subtasks).map(k => ({...subtasks[k], key: k})).sort(getSortModeFunc(sortMode));
    return sortedSubtasks.map(l => l.key);
}

function LessonPage({ lesson, completionState, onChangeCompleted, onChangeSubtask, onClose, isOpen }) {
    const [openSubtask, setOpenSubtask] = useState(null);
    const [sortMode, setSortMode] = useState(0);

    const lessonSubtaskList = useMemo(() => sortLessonSubtasks(lesson.subtasks || [], sortMode), [lesson, sortMode]);

    if (!lesson) {
        return <div/>
    }

    const completedSubtasks = Object.values(completionState?.subtasks ?? {}).filter((x) => x).length;
    const requiredSubtasks = lesson.subtasks_required;
    let subtaskCompletionText = `Lesson Complete!`;
    if (completedSubtasks < requiredSubtasks) {
        const moreNeeded = requiredSubtasks - completedSubtasks;
        subtaskCompletionText = `Learn ${completedSubtasks > 0 ? '' : 'any'} ${moreNeeded} ${completedSubtasks > 0 ? 'more' : ''} song${moreNeeded === 1 ? '' : 's'} to complete this lesson`;
    }

    return (
        <div className={isOpen?"backdrop":"backdrop-none"}>
            <div
                className="bounding-box-page"
                style={{
                    "--background-color": typeData[lesson.type].color,
                    top: isOpen?"2vh":"105vh",
                    overflowY: 'auto',
                    padding: '16px',
                }}
                
            >
                <button className="page-close" onClick={onClose}>X</button>
                <h2>{typeData[lesson.type].title}</h2>
                <h4>{lesson.title}</h4>
                <p>{lesson.description}</p>
                <Embed url={lesson.video_url}/>
                {lesson.subtasks && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                        <h2 style={{ gridColumn: 2 }}>{subtaskCompletionText}</h2>
                        <button
                            className="button"
                            onClick={() => setSortMode((prev) => (prev + 1) % 4)}
                            style={{
                                gridColumn: 3,
                                whiteSpace: 'nowrap',
                                padding: '8px',
                                width: '192px',
                                justifySelf: 'end',
                                "--background-color": typeData[lesson.type].color2,
                            }}
                        >
                            Sort by {getSortModeDisplay(sortMode)}
                        </button>
                    </div>
                )}
                {lesson.subtasks && (
                    <div style={{ width: "auto", height: 'auto', paddingBottom: '24px' }}>
                        {
                            lessonSubtaskList.map((subtaskKey) => {
                                const subtask = lesson.subtasks[subtaskKey];

                                return <LessonSubtask
                                    key={subtaskKey}
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
