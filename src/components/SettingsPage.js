import '../App.css';
import RadioButtons from './RadioButtons.jsx';
import SettingsGroup from './SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';

const SettingsPage = () => {
  const { theme, setTheme, showHiddenSongs, setShowHiddenSongs } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '8px', gap: '8px' }}>
      <SettingsGroup title="Theme">
        <RadioButtons
          options={[
            { value: 'dark', label: 'Dark Mode' },
            { value: 'light', label: 'Light Mode' },
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

export default SettingsPage;
