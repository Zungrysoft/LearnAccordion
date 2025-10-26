import '../App.css';
import React, { useCallback, useState } from 'react';
import exerciseData from '../data/exercises.json';
import { processForFilter, sortSongs } from '../helpers/sortingAndFiltering.js';
import genreData from '../data/genres.json';
import RadioButtons from '../components/RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';
import SettingsGroup from '../components/SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import TextInput from '../components/TextInput.js';
import { useLessonState } from '../context/LessonStateProvider.jsx';
import CheckBox from '../components/CheckBox.js';
import Metronome from '../components/Metronome.js';

export default function ExercisesPage() {
  const { colorBackground, colorText } = useTheme();
  const {
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
  const { lessonState, setLessonPinned } = useLessonState();

  const [filterText, setFilterText] = useState("");
  const [selectedExerciseId, setSelectedExercise] = useState(null);
  const exercises = Object.entries(exerciseData).map(([key, value]) => ({ ...value, id: key }));

  let filteredExercises = exercises;
  if (!showHiddenSongs) {
    filteredExercises = filteredExercises.filter((exercise) => !exercise.is_hidden)
  }
  if (!showLockedExercises) {
    filteredExercises = filteredExercises.filter((exercise) => lessonState[exercise.id]?.pinned || lessonState[exercise.lesson]?.unlocked)
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

  const exercisesMainColumn = filteredExercises.filter((exercise) => !lessonState[exercise.id]?.pinned) || [];
  const exercisesPinnedColumn = filteredExercises.filter((exercise) => lessonState[exercise.id]?.pinned) || [];
  const hasAnyPinnedExercises = exercises.some((exercise) => lessonState[exercise.id]?.pinned)

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '8px', gap: '8px', borderBottom: `2px solid ${colorText}`}}>
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
          <Metronome/>
        </SettingsGroup>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: 0, flex: 1 }}>
        <ExerciseEntryList exercises={exercisesMainColumn} selectedExerciseId={selectedExerciseId} setSelectedExercise={setSelectedExercise} />
        {hasAnyPinnedExercises &&
          <ExerciseEntryList exercises={exercisesPinnedColumn} selectedExerciseId={selectedExerciseId} setSelectedExercise={setSelectedExercise} />
        }
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
              <CheckBox
                text="Pin exercise:"
                onChange={(val) => setLessonPinned(selectedExerciseId, val)}
                checked={lessonState[selectedExerciseId]?.pinned}
                textColor={colorText}
            />
            </>
          )}
        </div>
      </div>
    </div>
  )
};

function ExerciseEntryList({ exercises, selectedExerciseId, setSelectedExercise }) {
  const { lessonState } = useLessonState();
  const { colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight, colorText } = useTheme();

  const getExerciseBackgroundColor = useCallback((exercise) => {
    if (exercise.id === selectedExerciseId) {
      return colorBackground;
    }
    if (exercise.is_hidden) {
      return colorBackgroundDarker;
    }
    return colorBackgroundDark;
  }, [selectedExerciseId, colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight]);

  return (
    <div style={{
      flexGrow: 0,
      flexShink: 2,
      minWidth: '300px',
      overflowY: 'scroll',
      height: '100%',
      backgroundColor: colorBackgroundDark,
      borderRight: `2px solid ${colorText}`,
    }}>
      {exercises.length === 0 ? (
        <p style={{ textAlign: "center", margin: '16px' }}>{`There are no exercises here\nthat match your filters.`}</p>
      ) : exercises.map((exercise) => (
        <div
          key={exercise.id}
          onClick={() => setSelectedExercise(exercise.id)}
          style={{ padding: '8px', cursor: 'pointer', backgroundColor: getExerciseBackgroundColor(exercise) }}
        >
          <ExerciseEntryTitle
            title={exercise.title}
            pinned={lessonState[exercise.id]?.pinned}
            active={lessonState[exercise.lesson]?.unlocked && !(lessonState[exercise.lesson]?.completed)}
            hidden={exercise.is_hidden}
            locked={!lessonState[exercise.lesson]?.unlocked} />
        </div>
      ))}
    </div>
  );
}

function ExerciseEntryTitle({ title, pinned, active, locked, hidden }) {
  const { colorText, filterIcon } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
      {pinned && (
        <img
          src={`${process.env.PUBLIC_URL}/icon/pin.png`}
          alt=""
          style={{
            width: '16px',
            height: '16px',
            filter: filterIcon,
          }}
        />
      )}
      {active && (!pinned) && (
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
      {locked && (!hidden) && (
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
      <h2 style={{ fontSize: 20, margin: 0, color: colorText }}>
        {title}
      </h2>
    </div>
  );
}
