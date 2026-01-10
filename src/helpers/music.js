export function frequencyToNote(f) {
  const middleC = 261.6255653;
  const output = 12 * Math.log2(f / middleC);
  return Math.round(output);
}

export function noteToFrequency(n) {
  const middleC = 261.6255653;
  const output = middleC * Math.pow(2, n / 12);
  return Math.round(output * 1000) / 1000;
}

export function getNoteName(n, withOctave = false, flat = false) {
  const noteBasesSharp = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const noteBasesFlat  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

  const noteBase = ((n % 12) + 12) % 12;
  const noteOctave = withOctave ? String(Math.floor(n / 12) - 2) : "";

  return (flat ? noteBasesFlat[noteBase] : noteBasesSharp[noteBase]) + noteOctave;
}

export function isNoteWhite(n) {
  return (n % 12) in [0, 2, 4, 5, 7, 9, 11];
}

export function getIntervalName(i) {
  i = Math.abs(i);
  const intervals = [
    "Unison", "Minor Second", "Major Second", "Minor Third", "Major Third",
    "Perfect Fourth", "Tritone", "Perfect Fifth", "Minor Sixth", "Major Sixth",
    "Minor Seventh", "Major Seventh", "Octave", "Minor Ninth", "Major Ninth",
    "Minor Tenth", "Major Tenth", "Pefect Eleventh", "Octave + Tritone",
    "Perfect Twelfth", "Minor Thirteenth", "Major Thirteenth",
    "Minor Fourteenth", "Major Fourteenth", "Two Octaves"
  ];
  return i >= intervals.length ? null : intervals[i];
}

export function fretToNote(string, fret) {
  const strings = [4, -1, -5, -10, -15, -20];

  if (string > strings.length || string <= 0) return null;

  if (fret === 'o' || fret === 'O') fret = 0;
  fret = Number(fret);
  if (Number.isNaN(fret)) return null;

  return strings[string - 1] + fret;
}
