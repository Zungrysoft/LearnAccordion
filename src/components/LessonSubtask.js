import '../App.css';
import React, { useRef, useState } from 'react';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';

function SubtaskTitle({ title, artist, completed, hasLyrics, hasBackingTrack }) {
    let titleText = artist ?
        `${artist} - ${title}` :
        title;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <h2 style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                {titleText}
            </h2>
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

    let genreIcon = null;
    if (['rock', 'metal', 'alternative', 'blues', 'rhythm and blues'].includes(genre.toLowerCase())) {
        genreIcon = 'guitar';
    }
    else if (['classical'].includes(genre.toLowerCase())) {
        genreIcon = 'piano2'
    }
    else if (['orchestra'].includes(genre.toLowerCase())) {
        genreIcon = 'violin'
    }
    else if (['soundtrack'].includes(genre.toLowerCase())) {
        genreIcon = 'television'
    }
    else if (['showtune'].includes(genre.toLowerCase())) {
        genreIcon = 'theater'
    }
    else if (['folk'].includes(genre.toLowerCase())) {
        genreIcon = 'clap'
    }
    else if (['pop'].includes(genre.toLowerCase())) {
        genreIcon = 'microphone'
    }
    else if (['jazz', 'ska', 'swing'].includes(genre.toLowerCase())) {
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
    else if (['video game music', 'chiptune'].includes(genre.toLowerCase())) {
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
                    if (!isOpen) {
                        mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    onClickTitle();
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
                    <SubtaskTitle
                        title={subtask.title}
                        artist={subtask.artist}
                        completed={completed}
                        hasLyrics={subtask.has_lyrics}
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
