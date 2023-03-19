import '../App.css';
import React, {useState, useEffect} from 'react';
import settingsData from '../data/settings.json';
import typeData from '../data/types.json';
import Embed from './Embed';
import CheckBox from './CheckBox';

function LessonPage({ lesson, state, onChange, onClose, isOpen }) {
    if (!lesson) {
        return <div/>
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
                <Embed url={lesson.video_url}/>
                <p>{lesson.description}</p>
                <CheckBox text="Mark as completed:" onChange={onChange} checked={state.completed}/>

            </div>
        </div>
    )
}

export default LessonPage;
