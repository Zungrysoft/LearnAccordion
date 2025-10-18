import '../App.css';
import React, { useCallback, useState } from 'react';
import songData from '../data/songs.json';
import exerciseData from '../data/exercises.json';
import { processForFilter, sortSongs } from '../helpers/sortingAndFiltering.js';
import genreData from '../data/genres.json';
import RadioButtons from './RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';
import SettingsGroup from './SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import TextInput from './TextInput.js';
import { useLessonState } from '../context/LessonStateProvider.jsx';

export default function ExercisesPage() {
  const { colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight, colorText } = useTheme();
  const {
    showLockedExercises,
    setShowLockedExercises,
    showHiddenSongs,
  } = useSettings();
  const { lessonState, lessonData } = useLessonState();

  const [filterText, setFilterText] = useState("");
  const exercises = Object.entries(exerciseData).map(([key, value]) => ({ ...value, id: key }));

  const isExerciseUnlocked = useCallback((exercise) => {
      if (!exercise.lesson) {
        return true;
      }

      return !!lessonState[exercise.lesson]?.unlocked;
    }, [lessonState])
  
  const getExerciseBackgroundColor = useCallback((exercise) => {
    if (exercise.is_hidden) {
      return colorBackgroundDarker;
    }
    if (lessonState[exercise.id]?.completed) {
      return colorBackgroundLight;
    }
    if (isExerciseUnlocked(exercise)) {
      return colorBackground;
    }
    return colorBackgroundDark;
  }, [lessonState, isExerciseUnlocked, colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight]);

  let filteredExercises = exercises;
  if (!showHiddenSongs) {
    filteredExercises = filteredExercises.filter((exercise) => !exercise.is_hidden)
  }
  if (!showLockedExercises) {
    filteredExercises = filteredExercises.filter((exercise) => lessonState[exercise.id]?.pinned || isExerciseUnlocked(exercise))
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

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 2, overflowY: 'auto', margin: '16px' }}>
        {filteredExercises.map((exercise) => (
          <div key={exercise.id}>
            <ExerciseEntryTitle
              title={exercise.title}
            />
            </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: '640px', overflowY: 'auto', margin: '16px'  }}>
        DSA
      </div>
    </div>
  )
};

function ExerciseEntryTitle({ title, pinned, completed, locked, hidden }) {
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
      {completed && (
        <img
          src={`${process.env.PUBLIC_URL}/icon/check.png`}
          alt=""
          style={{
            width: '16px',
            height: '16px',
            filter: filterIcon,
          }}
        />
      )}
      {locked && (!hidden) && (!completed) && (
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
