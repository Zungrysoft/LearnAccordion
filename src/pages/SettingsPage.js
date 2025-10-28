import '../App.css';
import RadioButtons from '../components/RadioButtons.jsx';
import SettingsGroup from '../components/SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    showHiddenSongs,
    setShowHiddenSongs,
    compactExercises,
    setCompactExercises
  } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '8px', gap: '8px' }}>
      <SettingsGroup title="Theme">
        <RadioButtons
          options={[
            { value: 'light', label: 'Light Mode' },
            { value: 'dark', label: 'Dark Mode' },
          ]}
          selectedOption={theme}
          onChange={setTheme}
        />
      </SettingsGroup>
      <SettingsGroup title="Layout">
        <RadioButtons
          options={[
            { value: true, label: 'Compact Pinned Exercises' },
          ]}
          selectedOption={compactExercises}
          onChange={() => setCompactExercises((prev) => !prev)}
          isCheckbox
        />
      </SettingsGroup>
      <SettingsGroup title="Developer">
        <RadioButtons
          options={[
            { value: true, label: 'Show Hidden Songs' },
          ]}
          selectedOption={showHiddenSongs}
          onChange={() => setShowHiddenSongs((prev) => !prev)}
          isCheckbox={true}
        />
      </SettingsGroup>
    </div>
  );
}
