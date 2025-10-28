import '../App.css';
import React, { useCallback, useMemo } from 'react';
import configData from '../data/config.json';
import typeData from '../data/types.json';
import sightReadingExerciseData from '../data/sight_reading_exercises.json';
import { useTheme } from '../helpers/theme';
import { useSightReading } from '../context/SightReadingProvider';
import CheckBox from './CheckBox';

export default function SightReading() {
  const { colorText, colorBackgroundDark, colorBackgroundLight } = useTheme();
  const {
    activeExerciseId,
    setActiveExerciseId,
    getExerciseState,
    setExerciseShowSolution,
    showPreviousExercises,
    setShowPreviousExercises,
    setExerciseCompleted,
    difficulty,
    setDifficulty,
  } = useSightReading();

  const currentSightReadingExercise = sightReadingExerciseData[activeExerciseId];
  const { completed, showSolution } = getExerciseState(activeExerciseId);

  const completedExerciseIds = useMemo(() => {
    let ret = new Set();
    Object.keys(sightReadingExerciseData).forEach((exerciseId) => {
      if (getExerciseState(exerciseId).completed) {
        ret.add(exerciseId);
      }
    })
    return ret;
  }, [getExerciseState]);
  

  const buttonStyle = {
    margin: '8px',
    border: `2px solid ${colorText}`,
    borderRadius: '8px',
    textDecoration: 'none',
    backgroundColor: 'inherit',
  };

  return (
    <div>
      <h2 style={{ color: colorText, margin: '8px', marginTop: '-16px' }}>#{activeExerciseId}</h2>
      <SheetMusic exercise={currentSightReadingExercise}/>
      <p style={{ color: colorText, marginTop: '4px' }}>{currentSightReadingExercise?.description}</p>
      <button
        style={{ width: '100%', border: '0px', backgroundColor: colorBackgroundDark }}
        onClick={() => {setExerciseShowSolution(activeExerciseId, !showSolution)}}
      >
        <h2 style={{ color: colorText, margin: '8px', fontSize: '16px' }}>{showSolution ? 'Hide Solution' : 'Show Solution'}</h2>
      </button>
      {showSolution && (
        <SheetMusic exercise={currentSightReadingExercise}/>
      )}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '16px' }}>
        <div style={{ flex:1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
          <CheckBox
            text="Mark as completed:"
            onChange={(val) => setExerciseCompleted(activeExerciseId, val)}
            checked={completed}
            textColor={colorText}
          />
          <button style={buttonStyle}>
            <h2 style={{ margin: '8px 32px', color: colorText }}>Random exercise</h2>
          </button>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: '100%' }}>
            <div style={{ fontSize: "14px", color: colorText, width: '120px' }}>Difficulty {difficulty.toFixed(1)}</div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.1}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>
        </div>
        <div style={{ flex:1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
          <button
            style={{ width: '100%', border: '0px', backgroundColor: colorBackgroundDark }}
            onClick={() => {setShowPreviousExercises(!showPreviousExercises)}}
          >
            <h2 style={{ color: colorText, margin: '8px', fontSize: '16px' }}>{showPreviousExercises ? 'Hide List' : 'Show List'}</h2>
          </button>
          {showPreviousExercises && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                backgroundColor: colorBackgroundDark,
                maxHeight: '300px',
                overflowY: 'auto',
                overflowX: 'clip'
              }}
            >
              {Object.keys(sightReadingExerciseData).map((id) => (
                <div onClick={() => setActiveExerciseId(id)} key={id} style={{ flexGrow: 1, minWidth: '60px', backgroundColor: colorBackgroundLight }}>
                  <h2
                    style={{
                      color: colorText,
                      margin: '16px',
                      fontSize: '16px',
                      textDecoration: completedExerciseIds.has(id) ? 'line-through' : null,
                      fontWeight: 'normal'
                    }}
                    >
                      #{id}
                    </h2>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SheetMusic({ exercise }) {
  if (!exercise) {
    return null;
  }

  return (
    <img
      src={`${process.env.PUBLIC_URL}/sheet_music/sight_reading_practice/${exercise.sheet_music}.svg`}
      alt=""
      style={{
        width: '100%',
        backgroundColor: 'white',
      }}
    />
  );
}
