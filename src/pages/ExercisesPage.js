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
import SightReading from '../components/SightReading.js';
import { SightReadingProvider } from '../context/SightReadingProvider.jsx';
import Tabs from '../components/Tabs.js';

const MIN_EXERCISE_ENTRY_WIDTH_PX = 410;

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
  let exercisesPinned = filteredExercises.filter((exercise) => lessonState[exercise.id]?.pinned) || [];
  const hasAnyPinnedExercises = exercisesPinned.length > 0;

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
        <ExerciseEntryList
          exercisesAll={exercisesAll}
          exercisesPinned={exercisesPinned}
          selectedExerciseId={selectedExerciseId}
          setSelectedExercise={setSelectedExercise}
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
              {(exerciseData[selectedExerciseId].is_sight_reading || exerciseData[selectedExerciseId].is_ear_training) && (
                <SightReadingProvider isSightReading={exerciseData[selectedExerciseId].is_sight_reading}>
                  <SightReading isSightReading={exerciseData[selectedExerciseId].is_sight_reading} />
                </SightReadingProvider>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
};

function ExerciseEntryList({ exercisesAll, exercisesPinned, selectedExerciseId, setSelectedExercise }) {
  const { lessonState } = useLessonState();
  const { colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight, colorText } = useTheme();
  const { showPinnedExercises, setShowPinnedExercises } = useSettings();

  const getExerciseBackgroundColor = useCallback((exercise) => {
    if (exercise.id === selectedExerciseId) {
      return colorBackground;
    }
    if (exercise.is_hidden) {
      return colorBackgroundDarker;
    }
    return colorBackgroundDark;
  }, [selectedExerciseId, colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight]);

  const containerStyle = {
    flexGrow: 0,
    flexShink: 2,
    height: '100%',
    backgroundColor: colorBackgroundDark,
    borderRight: `2px solid ${colorText}`,
  };

  const listContainerStyle = {
    flexGrow: 0,
    flexShink: 2,
    overflowY: 'scroll',
    height: '100%',
  };

  const exercises = showPinnedExercises ? exercisesPinned : exercisesAll;

  return (
    <div style={containerStyle}>
      <Tabs
        tabs={[
          { id: 'all', title: 'All Exercises' },
          { id: 'pinned', title: 'Regimen' },
        ]}
        activeTab={ showPinnedExercises ? 'pinned' : 'all' }
        setActiveTab={ (tab) => setShowPinnedExercises(tab === 'pinned') }
      />
      {exercises.length === 0 ? (
        <p style={{ textAlign: "center", margin: '16px', minWidth: `${MIN_EXERCISE_ENTRY_WIDTH_PX}px` }}>{`There are no exercises here\nthat match your filters.`}</p>
      ) : (
        <div style={listContainerStyle}>
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              style={{ padding: '0px', cursor: 'pointer', backgroundColor: getExerciseBackgroundColor(exercise) }}
            >
              <ExerciseEntry
                id={exercise.id}
                title={exercise.title}
                pinned={lessonState[exercise.id]?.pinned}
                active={(lessonState[exercise.lesson]?.unlocked && !(lessonState[exercise.lesson]?.completed)) || exercise.require_lesson_complete}
                hidden={exercise.is_hidden}
                locked={!(lessonState[exercise.lesson]?.completed || (lessonState[exercise.lesson]?.unlocked && !(exercise.require_lesson_complete)))}
                isPinnedList={showPinnedExercises}
              />
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

function ExerciseEntry({ id, title, pinned, active, locked, hidden, isPinnedList, isExpanded }) {
  const { colorText, filterIcon } = useTheme();
  const { lessonState, setLessonPinned } = useLessonState();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px'}}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px', padding: '0px 8px', minWidth: `${MIN_EXERCISE_ENTRY_WIDTH_PX}px` }}>
        {!isPinnedList && (
          <button
            onClick={(event) => {
              setLessonPinned(id, !lessonState[id].pinned);
              event.stopPropagation();
            }}
            style={{
              cursor: 'pointer',
              backgroundColor: 'inherit',
              border: '0px',
              margin: '0px',
              margin: '0px -8px',
              padding: '8px',
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/icon/${pinned ? 'pin_filled' : 'pin'}.png`}
              alt=""
              style={{
                width: '16px',
                height: '16px',
                filter: filterIcon,
              }}
            />
          </button>
        )}
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
          {title}
        </h2>
      </div>
    </div>
  );
}
