import '../App.css';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import exerciseData from '../data/exercises.json';
import { processForFilter } from '../helpers/sortingAndFiltering.js';
import RadioButtons from '../components/RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';
import SettingsGroup from '../components/SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import TextInput from '../components/TextInput.js';
import { useLessonState } from '../context/LessonStateProvider.jsx';
import Metronome from '../components/Metronome.js';
import SightReading from '../exerciseFeatures/SightReading.jsx';
import { SightReadingProvider } from '../context/SightReadingProvider.jsx';
import Tabs from '../components/Tabs.js';
import BasicButton from '../components/BasicButton.js';
import { exerciseFrequencyMap, useExerciseSettings } from '../context/ExerciseSettingsProvider.jsx';
import IdentifyNoteOnButtonBoard from '../exerciseFeatures/IdentifyNoteOnButtonBoard.jsx';
import FindNoteOnButtonBoard from '../exerciseFeatures/FindNoteOnButtonBoard.jsx';
import { Navigate } from 'react-router-dom';

const EXERCISE_ENTRY_WIDTH_PX = 410;
const EXERCISE_SETTINGS_WIDTH_PX = 290;

export default function ExercisesPage() {
    const { colorBackground, colorText } = useTheme();
    const {
        isDeveloper,
        showLockedExercises,
        setShowLockedExercises,
        showHiddenSongs,
        showRightHandExercises,
        setShowRightHandExercises,
        showLeftHandExercises,
        setShowLeftHandExercises,
        showTwoHandExercises,
        setShowTwoHandExercises,
    } = useSettings();
    const { lessonState, exercises } = useLessonState();
    const [isExpanded, setIsExpanded] = useState(false);
    const { regimen } = useExerciseSettings();

    const [filterText, setFilterText] = useState("");
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);

    useLayoutEffect(() => {
        if (regimen.length > 0) {
            setSelectedExerciseId(regimen[0].id);
        }
    }, [regimen])

    let filteredExercises = exercises;
    if (!showHiddenSongs) {
        filteredExercises = filteredExercises.filter((exercise) => !exercise.is_hidden)
    }
    if (!showLockedExercises) {
        filteredExercises = filteredExercises.filter((exercise) =>
            lessonState[exercise.id]?.pinned ||
            (lessonState[exercise.lesson]?.unlocked && !(exercise?.require_lesson_complete)) ||
            lessonState[exercise.lesson]?.completed
        )
    }
    const noExercisesUnlocked = filteredExercises.length === 0;
    if (!showRightHandExercises) {
        filteredExercises = filteredExercises.filter((exercise) => exercise.hand !== 'right')
    }
    if (!showLeftHandExercises) {
        filteredExercises = filteredExercises.filter((exercise) => exercise.hand !== 'left')
    }
    if (!showTwoHandExercises) {
        filteredExercises = filteredExercises.filter((exercise) => exercise.hand !== 'both')
    }
    if (filterText.length > 0) {
        filteredExercises = filteredExercises.filter((exercise) => {
            for (const filterWord of filterText.split(" ")) {
                const fw = processForFilter(filterWord);

                if (!(
                    processForFilter(exercise.title).includes(fw) ||
                    processForFilter(exercise.search_text || "").includes(fw)
                )) {
                    return false;
                }
            }
            return true;
        })
    }

    let exercisesAll = filteredExercises || [];

    // Not ready for release
    if (!isDeveloper) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '8px', gap: '8px', borderBottom: `2px solid ${colorText}` }}>
                <SettingsGroup title="Filter Exercises" scale={3}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: 'start', gap: "0px", padding: '0px' }}>
                        <RadioButtons
                            options={[
                                { value: true, label: 'Show right hand exercises' },
                            ]}
                            selectedOption={showRightHandExercises}
                            onChange={() => setShowRightHandExercises((prev) => !prev)}
                            isCheckbox
                        />
                        <RadioButtons
                            options={[
                                { value: true, label: 'Show left hand exercises' },
                            ]}
                            selectedOption={showLeftHandExercises}
                            onChange={() => setShowLeftHandExercises((prev) => {
                                return !prev;
                            })}
                            isCheckbox
                        />
                        <RadioButtons
                            options={[
                                { value: true, label: 'Show two-hand exercises' },
                            ]}
                            selectedOption={showTwoHandExercises}
                            onChange={() => setShowTwoHandExercises((prev) => !prev)}
                            isCheckbox
                        />
                    </div>
                    <RadioButtons
                        options={[
                            { value: true, label: 'Show locked exercises' },
                        ]}
                        selectedOption={showLockedExercises}
                        onChange={() => setShowLockedExercises((prev) => !prev)}
                        isCheckbox
                    />
                    <TextInput
                        value={filterText}
                        onChange={setFilterText}
                        onClear={() => setFilterText("")}
                        placeholder="Search"
                    />
                </SettingsGroup>
                <SettingsGroup title="Metronome" scale={2} minWidth="400px">
                    <Metronome />
                </SettingsGroup>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: 0, flex: 1 }}>
                <ExerciseEntryList
                    exercisesAll={exercisesAll}
                    exercisesPinned={regimen}
                    selectedExerciseId={selectedExerciseId}
                    setSelectedExerciseId={setSelectedExerciseId}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    backgroundColor: colorBackground,
                    minHeight: 0,
                }}>
                    {selectedExerciseId && (
                        <>
                            <h4 style={{ fontSize: 30, color: colorText }}>{exerciseData[selectedExerciseId]?.title}</h4>
                            <p style={{ color: colorText }}>{exerciseData[selectedExerciseId]?.description}</p>

                            {(exerciseData[selectedExerciseId].feature === 'sight_reading' || exerciseData[selectedExerciseId].feature === 'ear_training') && (
                                <SightReadingProvider isSightReading={exerciseData[selectedExerciseId].feature === 'sight_reading'}>
                                    <SightReading isSightReading={exerciseData[selectedExerciseId].feature === 'sight_reading'} />
                                </SightReadingProvider>
                            )}
                            {exerciseData[selectedExerciseId].feature === 'identify_note_on_button_board' && (
                                <IdentifyNoteOnButtonBoard />
                            )}
                            {exerciseData[selectedExerciseId].feature === 'find_note_on_button_board' && (
                                <FindNoteOnButtonBoard />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
};

function ExerciseEntryList({ exercisesAll, exercisesPinned, selectedExerciseId, setSelectedExerciseId, isExpanded, setIsExpanded }) {
    const { colorBackgroundDark, colorBackgroundLight, colorText } = useTheme();
    const { showPinnedExercises, setShowPinnedExercises } = useSettings();
    const { generateRegimen, setRegimenSize, regimenSize, exercisesAvailableForRegimen } = useExerciseSettings();

    const exercisesPinnedShortened = isExpanded ? exercisesPinned : exercisesPinned.slice(0, regimenSize);
    const exercises = showPinnedExercises ? exercisesPinnedShortened : exercisesAll;

    const containerStyle = {
        flexGrow: 0,
        flexShink: 2,
        height: '100%',
        backgroundColor: colorBackgroundDark,
        borderRight: `2px solid ${colorText}`,
        display: 'flex',
        flexDirection: 'column',
    };

    const listContainerStyle = {
        flexGrow: 1,
        flexShink: 2,
        overflowY: 'scroll',
        minHeight: '0px',
    };

    return (
        <div style={containerStyle}>
            <Tabs
                tabs={[
                    { id: 'all', title: 'All Exercises' },
                    { id: 'pinned', title: 'Today\'s Regimen' },
                ]}
                activeTab={showPinnedExercises ? 'pinned' : 'all'}
                setActiveTab={(tab) => setShowPinnedExercises(tab === 'pinned')}
                smallTabs
            />
            {exercises.length === 0 ? (
                <p style={{ textAlign: "center", margin: '16px', flexGrow: 1, width: `${EXERCISE_ENTRY_WIDTH_PX}px` }}>
                    {showPinnedExercises ? `There are no exercises in your regimen.\n\nTo build a regimen, click 'All Exercises', enable Edit Mode, then add exercises to your regimen.` : `There are no exercises here\nthat match your filters.`}
                </p>
            ) : (
                <div style={listContainerStyle}>
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            style={{ padding: '0px' }}
                        >
                            <ExerciseEntry
                                exercise={exercise}
                                isPinnedList={showPinnedExercises}
                                isExpanded={isExpanded}
                                onSelect={() => setSelectedExerciseId(exercise.id)}
                                selected={exercise.id === selectedExerciseId}
                                lined={showPinnedExercises && index === regimenSize}
                            />
                        </div>
                    ))}
                </div>
            )}
            <div style={{ display: 'flex', flexGrow: 0, minHeight: '48px', borderTop: `2px solid ${colorText}`, alignItems: 'center' }}>
                <div style={{ borderRight: `2px solid ${colorText}`, height: "100%" }}>
                    <BasicButton
                        text="Edit"
                        icon="pencil"
                        backgroundColor={isExpanded ? colorBackgroundLight : undefined}
                        onClick={() => setIsExpanded((prev) => !prev)}
                        width="120px"
                    />
                </div>
                <div style={{ borderRight: `2px solid ${colorText}`, width: "86px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <BasicButton
                        icon="arrow_left"
                        onClick={() => setRegimenSize((prev) => Math.max(prev - 1, 1))}
                        disabled={regimenSize <= 1}
                        height="32px"
                        width="32px"
                    />
                    <h2 style={{ color: colorText, margin: '0px', marginBottom: '4px' }}>{regimenSize}</h2>
                    <BasicButton
                        icon="arrow_right"
                        onClick={() => setRegimenSize((prev) => Math.min(prev + 1, 25))}
                        disabled={regimenSize >= 25}
                        height="32px"
                        width="32px"
                    />
                </div>
                <BasicButton
                    text="Generate Regimen"
                    icon="clock"
                    disabled={exercisesAvailableForRegimen.length === 0}
                    onClick={() => {
                        generateRegimen(true);
                        setShowPinnedExercises(true);
                    }}
                />
            </div>
        </div>
    );
}

function ExerciseEntry({ exercise, isPinnedList, isExpanded, selected, onSelect, lined }) {
    const { lessonState } = useLessonState();
    const hidden = exercise.is_hidden;
    const locked = !(lessonState[exercise.lesson]?.completed || (lessonState[exercise.lesson]?.unlocked && !(exercise.require_lesson_complete)));
    const active = (lessonState[exercise.lesson]?.unlocked && !(lessonState[exercise.lesson]?.completed));
    const { colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight, colorText, filterIcon } = useTheme();
    const { getExerciseFrequency, setExerciseFrequency } = useExerciseSettings();

    const getExerciseBackgroundColor = useCallback((exercise) => {
        if (selected) {
            return colorBackground;
        }
        if (exercise.is_hidden) {
            return colorBackgroundDarker;
        }
        return colorBackgroundDark;
    }, [selected, colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
                backgroundColor: getExerciseBackgroundColor(exercise),
                borderTop: lined ? `2px solid ${colorText}` : null,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'start',
                    gap: '12px',
                    padding: '0px 8px',
                    cursor: 'pointer',
                    minWidth: `${EXERCISE_ENTRY_WIDTH_PX}px`,
                }}
                onClick={onSelect}
            >
                {active && (!locked) && (!isPinnedList) && (
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/pointer.png`}
                        alt=""
                        style={{
                            width: '12px',
                            height: '12px',
                            marginRight: '-6px',
                            filter: filterIcon,
                        }}
                    />
                )}
                {locked && (!hidden) && (!isPinnedList) && (
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/lock.png`}
                        alt=""
                        style={{
                            width: '16px',
                            height: '16px',
                            filter: filterIcon,
                        }}
                    />
                )}
                {hidden && (
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/warning.png`}
                        alt=""
                        style={{
                            width: '16px',
                            height: '16px',
                            filter: filterIcon,
                        }}
                    />
                )}
                <h2 style={{ fontSize: 20, margin: '8px 0px', color: colorText }}>
                    {exercise.title}
                </h2>
            </div>
            {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px', minWidth: `${EXERCISE_SETTINGS_WIDTH_PX}px` }}>
                    {getExerciseFrequency(exercise.id) > 0 ? (
                        <>
                            <h2 style={{ fontSize: "13px", width: '110px', textAlign: 'left', color: colorText }}>
                                {exerciseFrequencyMap[getExerciseFrequency(exercise.id)]?.display}
                            </h2>
                            <input
                                type="range"
                                min={1}
                                max={exerciseFrequencyMap.length - 1}
                                step={-1}
                                value={exerciseFrequencyMap.length - getExerciseFrequency(exercise.id)}
                                onChange={(e) => setExerciseFrequency(exercise.id, exerciseFrequencyMap.length - Number(e.target.value))}
                                style={{ width: "120px" }}
                            />
                            <div style={{ padding: '6px', cursor: 'pointer' }} onClick={() => { setExerciseFrequency(exercise.id, 0) }}>
                                <img
                                    key={"trash"}
                                    src={`${process.env.PUBLIC_URL}/icon/trash.png`}
                                    alt=""
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        filter: filterIcon,
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '8px', cursor: 'pointer' }} onClick={() => { setExerciseFrequency(exercise.id, 1) }}>
                            <img
                                key={"plus"}
                                src={`${process.env.PUBLIC_URL}/icon/plus.png`}
                                alt=""
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    filter: filterIcon,
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
