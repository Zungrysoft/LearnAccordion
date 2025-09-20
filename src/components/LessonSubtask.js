import '../App.css';
import React, { useRef, useState } from 'react';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';
import genreData from '../data/genres.json';

function SubtaskTitle({ title, artist, completed, hasLyrics, hasBackingTrack, difficulty }) {
    let titleText = artist ?
        `${artist} - ${title}` :
        title;
    
    const hasDifficulty = !!(difficulty && difficulty >= 1 && difficulty < 5);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <h2 style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                {titleText}
            </h2>
            {hasDifficulty && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/stars_${Math.floor(difficulty)}.png`}
                    alt=""
                    style={{
                        width: '24px',
                        height: '24px',
                    }}
                />
            )}
            {hasLyrics && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/microphone2.png`}
                    alt=""
                    style={{
                        width: '24px',
                        height: '24px',
                    }}
                />
            )}
            {hasBackingTrack && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/music.png`}
                    alt=""
                    style={{
                        width: '24px',
                        height: '24px',
                    }}
                />
            )}
        </div>
    );
    
}

function GenreIndicator({ genre }) {
    if (!genre) {
        return null;
    }

    let { display, icon } = genreData[genre?.toLowerCase()];

    if (!display) {
        return null;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 'normal', fontStyle: 'italic' }}>{display}</h2>
            {icon && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
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

function LessonSubtask({ lesson, subtaskKey, subtask, onClickTitle, toggleCompletion, isOpen, completed }) {
    const mainRef = useRef(null);

    return (
        <div
            key={subtaskKey}
            style={{
                marginBottom: "8px",
            }}
            ref={mainRef}
        >
            <button
                style={{
                    width: "100%",
                    textAlign: "left",
                    border: "solid",
                    backgroundColor: typeData[lesson.type].color2,
                    borderRadius: isOpen ? "8px 8px 0 0" : "8px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    // if (!isOpen) {
                    //     mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // }
                    onClickTitle();
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
                    <SubtaskTitle
                        title={subtask.title}
                        artist={subtask.artist}
                        completed={completed}
                        hasLyrics={subtask.has_vocals}
                        difficulty={subtask.difficulty}
                        hasBackingTrack={subtask.has_backing_track}
                    />
                    <GenreIndicator genre={subtask.genre} />
                </div>
            </button>
            {isOpen && (
                <div
                    style={{
                        padding: "12px",
                        backgroundColor: typeData[lesson.type].color2,
                        borderRadius: "0 0 8px 8px",
                    }}
                >
                    <p>{subtask.description}</p>
                    <Embed url={subtask.video_url}/>
                    <CheckBox
                        text="Mark as completed:"
                        onChange={toggleCompletion}
                        checked={completed}
                    />
                </div>
            )}
        </div>
    );
}


export default LessonSubtask;
