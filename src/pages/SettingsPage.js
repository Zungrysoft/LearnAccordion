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
