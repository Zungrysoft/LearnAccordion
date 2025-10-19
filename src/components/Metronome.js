// import { useState } from "react";
// import { useTheme } from "../helpers/theme";
// import RadioButtons from "./RadioButtons";

// export default function Metronome() {
//   const { colorText } = useTheme();
//   const [timeSignature, setTimeSignature] = useState('4/4');

//   return (
//     <div style={{ display: "flex", flexDirection: "row", alignItems: 'start', gap: '8px' }}>
//       <RadioButtons
//         options={[
//           { value: '4/4', label: '4/4' },
//           { value: '3/4', label: '3/4' },
//           { value: '6/8', label: '6/8' },
//         ]}
//         selectedOption={timeSignature}
//         onChange={setTimeSignature}
//       />
//       <RadioButtons
//         options={[
//           { value: '7/8', label: '7/8' },
//           { value: '5/4', label: '5/4' },
//           { value: 'none', label: 'None' },
//         ]}
//         selectedOption={timeSignature}
//         onChange={setTimeSignature}
//       />
//       <div style={{ display: "flex", flexDirection: "column", alignItems: 'start', gap: '8px' }}>

//       </div>
//     </div>
//   );
// }


import React, { useCallback, useEffect, useRef, useState } from "react";
import RadioButtons from "./RadioButtons";
import { useLessonState } from "../context/LessonStateProvider";
import { useSettings } from "../context/SettingsProvider";
import { useTheme } from "../helpers/theme";

const timeSignatures = {
  '4/4': {
    title: '4/4',
    beats: [2, 1, 1, 1],
    speedMultiplier: 1,
  },
  '3/4': {
    title: '3/4',
    beats: [2, 1, 1],
    speedMultiplier: 1,
  },
  '6/8': {
    title: '6/8',
    beats: [2, 1, 1, 1, 1, 1],
    speedMultiplier: 2,
  },
  '7/8': {
    title: '7/8',
    beats: [2, 1, 1, 1, 1, 1, 1],
    speedMultiplier: 2,
  },
  '9/8': {
    title: '9/8',
    beats: [2, 1, 1, 1, 1, 1, 1, 1, 1],
    speedMultiplier: 2,
  },
  '9/8 aksak': {
    title: '9/8 ak.',
    beats: [

      2, 0,
      1, 0,
      1, 0,
      1, 0, 0,

      1, 0,
      1, 0,
      1, 0,
      1, 0, 0,

    ],
    speedMultiplier: 4,
  },
  '5/4': {
    title: '5/4',
    beats: [2, 1, 1, 1, 1],
    speedMultiplier: 1,
  },
  '11/8': {
    title: '11/8 ak.',
    beats: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    speedMultiplier: 2,
  },
  'none': {
    title: 'none',
    beats: [1, 1],
    speedMultiplier: 1,
  },
};

const timeSignatureGroupsBasic = [
  ['4/4', '3/4'],
  ['6/8', 'none'],
];

const timeSignatureGroupsIntermediate = [
  ['4/4', '3/4', '6/8'],
  ['5/4', '7/8', 'none'],
];

const timeSignatureGroupsAdvanced = [
  ['4/4', '3/4', '6/8'],
  ['5/4', '7/8', '9/8'],
  ['11/8', '9/8 aksak', 'none'],
];

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleActiveBeat, setVisibleActiveBeat] = useState(0);
  const { lessonState } = useLessonState();
  const { colorText } = useTheme();

  const {
    metronomeBpm: bpm,
    setMetronomeBpm: setBpm,
    metronomeVolume: volume,
    setMetronomeVolume: setVolume,
    metronomeTimeSignature: timeSignature,
    setMetronomeTimeSignature: setTimeSignature,
  } = useSettings();

  const audioCtxRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const schedulerTimerRef = useRef(null);
  const volumeRef = useRef(volume);
  const timeoutsRef = useRef([]);

  const lookahead = 25.0;
  const scheduleAheadTime = 0.2;
  const gainMultiplier = 2;

  const circles = timeSignatures[timeSignature].beats.filter(b => b !== 0).length;
  const circleScale = 4.0 / Math.max(circles, 4.0);
  const circleSizeStyle = `${Math.floor(circleScale * 16)}px`;
  const circleGapStyle = `${Math.floor(circleScale * 6)}px`;

  let timeSignatureGroups = timeSignatureGroupsBasic;
  if (lessonState['irregular_time_signatures_2'].selectable) {
    timeSignatureGroups = timeSignatureGroupsAdvanced;
  }
  else if (lessonState['irregular_time_signatures_1'].selectable) {
    timeSignatureGroups = timeSignatureGroupsIntermediate;
  }
  

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
  };


  const getBpm = () => {
    return Math.min(Math.max(Number(bpm) || 0, 0), 1000);
  }

  const multiplyBpm = (scalar) => {
    setBpm((prev) => Math.floor(prev * scalar));
  }

  const secondsPerBeat = () => 60.0 / Math.max(1, getBpm()) / timeSignatures[timeSignature].speedMultiplier;

  const scheduleClick = (time, isDownbeat) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = isDownbeat ? 1000 : 1500;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volumeRef.current * gainMultiplier), time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  };

  const scheduleVisual = (scheduledTime, beatIndex) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const msUntil = Math.max(0, (scheduledTime - audioCtx.currentTime) * 1000);
    const id = window.setTimeout(() => {
      let visibleActiveBeat = 0;
      for (let i = 0; i <= beatIndex; i ++) {
        if (timeSignatures[timeSignature].beats[i] !== 0) {
          visibleActiveBeat ++;
        }
      }
      setVisibleActiveBeat(Math.max(visibleActiveBeat - 1, 0));
    }, msUntil);
    timeoutsRef.current.push(id);
  };

  const scheduler = () => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    while (nextNoteTimeRef.current < audioCtx.currentTime + scheduleAheadTime) {
      const currentBeat = currentBeatRef.current;
      const isDownbeat = timeSignatures[timeSignature].beats[currentBeat] === 2;
      const isBeat = timeSignatures[timeSignature].beats[currentBeat] !== 0;
      if (isBeat) {
        scheduleClick(nextNoteTimeRef.current, isDownbeat);
      }
      scheduleVisual(nextNoteTimeRef.current, currentBeat);

      nextNoteTimeRef.current += secondsPerBeat();
      currentBeatRef.current = (currentBeatRef.current + 1) % timeSignatures[timeSignature].beats.length;
    }
  };

  const stop = useCallback(() => {
    if (schedulerTimerRef.current) {
      clearInterval(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      const audioCtx = audioCtxRef.current;
      nextNoteTimeRef.current = audioCtx.currentTime + 0.05;
      currentBeatRef.current = 0;

      schedulerTimerRef.current = window.setInterval(scheduler, lookahead);

      return () => {
        stop();
      };
    } else {
      stop();
    }
  }, [isPlaying, bpm, timeSignature]);

  useEffect(() => {
    setVolume(v => Math.max(0, Math.min(1, v)));
  }, []);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const handleStartStop = () => {
    if (isPlaying) {
      setVisibleActiveBeat(0);
    }
    else {
      initAudio();
      const audioCtx = audioCtxRef.current;
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "12px",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: '60px',
  };

  const circleBaseStyle = {
    borderRadius: "50%",
    border: "2px solid",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  };

  return (
    <div style={{ display: "flex", gap: "8px", flex: 1, maxWidth: '400px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>

        <label style={{ flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "14px", color: colorText }}>BPM</div>
            <input
              type="number"
              min={0}
              max={1000}
              step={5}
              value={bpm}
              placeholder="Enter value"
              onChange={(e) => setBpm(e.target.value)}
              style={{ width: "48px", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px" }}>
              <button onClick={() => multiplyBpm(2.0)} style={{ ...buttonStyle, backgroundColor: "#2563eb", padding: '2px', width: '30px', fontSize: '9px' }}>
                x2
              </button>
              <button onClick={() => multiplyBpm(0.5)} style={{ ...buttonStyle, backgroundColor: "#2563eb", padding: '2px', width: '30px', fontSize: '9px' }}>
                ÷2
              </button>
            </div>
          </div>
        </label>

        <label style={{ width: "140px" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "14px", color: colorText }}>Volume</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>
        </label>

      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: '120px', flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={handleStartStop} style={{ ...buttonStyle, backgroundColor: isPlaying ? "#c43a31ff" : "#2563eb" }}>
            {isPlaying ? "Stop" : "Start"}
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: circleGapStyle, margin: '8px', height: '16px' }}>
          {timeSignatures[timeSignature].beats.filter(b => b !== 0).map((_strength, i) => {
            const isActive = visibleActiveBeat === i && isPlaying;
            const color = isActive ? "#22c55e" : "#f3f4f6";
            const borderColor = isActive ? "#16a34a" : "#d1d5db";
            const transform = isActive ? "scale(1.25)" : "scale(1.0)";
            return (
                <div
                  key={i}
                  style={{
                    ...circleBaseStyle,
                    width: circleSizeStyle,
                    height: circleSizeStyle,
                    backgroundColor: color,
                    borderColor: borderColor,
                    transform: transform,
                  }}
                />
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: 'start', gap: '8px', flexGrow: 1, flexShrink: 0 }}>
        {timeSignatureGroups.map((tsg, i) => (
          <RadioButtons
            key={i}
            options={tsg.map((ts) => ({ value: ts, label: timeSignatures[ts].title }))}
            selectedOption={timeSignature}
            onChange={setTimeSignature}
          />
        ))}
      </div>
    </div>
  );
}

