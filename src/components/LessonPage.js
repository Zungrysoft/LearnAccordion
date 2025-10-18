import '../App.css';
import React, { useMemo, useState } from 'react';
import typeData from '../data/types.json';
import songData from '../data/songs.json';
import Embed from './Embed';
import CheckBox from './CheckBox';
import LessonSubtask from './LessonSubtask';
import { useTheme } from '../helpers/theme';

function LessonPage({ lesson, completionState, onChangeCompleted, onChangePinned, onChangeSubtask, onClose, isOpen, state }) {
    const [openSubtask, setOpenSubtask] = useState(null);
    const subtasksList = Object.keys(lesson.subtasks ?? {}).map((key) => ({...lesson.subtasks[key], id: key}));
    const { colorBackground, colorText } = useTheme();

    let description = lesson.description
    if (!description && lesson.type === 'gate') {
        description = `Earn ${lesson.points_required ?? 0} stars to unlock this path. You can earn stars by learning songs in the 'Songs' tab.`;
    }
    
    const nearlyUnlockedSongs = useMemo(() => {
        if (completionState?.completed) {
            return [];
        }

        let ret = [];
        for (const songId in songData) {
            const song = songData[songId];

            if (song.is_hidden) {
                continue;
            }

            let requirementsSatisfied = 0;
            let requirementsWillSatisfy = 0;
            for (const requirement of song.requirements) {
                let satisfied = false
                for (const option of requirement) {
                    if (state[option]?.completed) {
                        satisfied = true;
                        break;
                    }
                }
                if (satisfied) {
                    requirementsSatisfied ++;
                }
                if (requirement.includes(lesson.id)) {
                    requirementsWillSatisfy ++;
                }
            }

            if (
                requirementsSatisfied + requirementsWillSatisfy === song.requirements.length &&
                requirementsSatisfied !== song.requirements.length
            ) {
                ret.push(songId);
            }
        }

        return ret;
    }, [state, lesson.id, completionState]);

    if (!lesson) {
        return null;
    }

    const completedSubtasks = Object.values(completionState?.subtasks ?? {}).filter((x) => x).length;
    const requiredSubtasks = lesson.subtasks_required;
    let subtaskCompletionText = `Lesson Complete!`;
    if (completedSubtasks < requiredSubtasks) {
        const moreNeeded = requiredSubtasks - completedSubtasks;
        subtaskCompletionText = `Complete ${completedSubtasks > 0 ? '' : 'any'} ${moreNeeded} ${completedSubtasks > 0 ? 'more' : ''} challenge${moreNeeded === 1 ? '' : 's'}`;
    }

    const lessonType = lesson.type ?? 'song';

    return (
        <div className={isOpen?"backdrop":"backdrop-none"}>
            <div
                className="bounding-box-page"
                style={{
                    "--background-color": colorBackground,
                    top: isOpen?"2vh":"105vh",
                    overflowY: 'auto',
                    padding: '16px',
                }}
            >
                <button className="page-close" onClick={onClose}>X</button>
                <h2 style={{ color: colorText }}>{typeData[lessonType].title}</h2>
                <h4 style={{ color: colorText }}>{lesson.title}</h4>
                <p style={{ color: colorText }}>{description}</p>
                <Embed url={lesson.video_url}/>
                {lesson.subtasks && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                        <h2 style={{ gridColumn: 2, color: colorText }}>{subtaskCompletionText}</h2>
                    </div>
                )}
                {lesson.subtasks && (
                    <div style={{ width: "auto", height: 'auto' }}>
                        {
                            subtasksList.map((subtask) => {
                                return <LessonSubtask
                                    key={subtask.id}
                                    lesson={lesson}
                                    subtask={subtask}
                                    toggleCompletion={(newState) => onChangeSubtask(subtask.id, newState)}
                                    onClickTitle={() => setOpenSubtask((prev) => {return prev === subtask.id ? null : subtask.id})}
                                    isOpen={openSubtask === subtask.id}
                                    completed={completionState?.subtasks?.[subtask.id]}
                                />;
                            })
                        }
                    </div>
                )}
                {lessonType === 'song' && (
                    <CheckBox text="Pin lesson:" onChange={onChangePinned} checked={completionState?.pinned} textColor={colorText}/>
                )}
                {!(lesson.subtasks) && (
                    <CheckBox
                        text={lesson.type === 'gate' ? "Bypass gate:" : "Mark as completed:"}
                        onChange={onChangeCompleted}
                        checked={completionState?.completed}
                        textColor={colorText}
                    />
                )}
                {nearlyUnlockedSongs.length > 0 && (
                    <h2 style={{ fontSize: 18, marginTop: '0px', color: colorText }}>
                        Completing this lesson will unlock new songs: {nearlyUnlockedSongs.map((x) => 
                            songData[x].is_title_inspecific ? songData[x].artist + " " + songData[x].title : songData[x].title
                        ).join(', ')}
                    </h2>
                )}
            </div>
        </div>
    )
}

export default LessonPage;
