import '../App.css';
import RadioButtons from '../components/RadioButtons.jsx';
import SettingsGroup from '../components/SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';

export default function SettingsPage() {
  const {
    isDeveloper,
    theme,
    setTheme,
    showHiddenSongs,
    setShowHiddenSongs,
    showDeveloperFilters,
    setShowDeveloperFilters
  } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px', alignItems: 'center', width: '100%', overflowY: 'auto' }}>
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
      {isDeveloper && (
        <SettingsGroup title="Developer">
          <div style={{ display: "flex", flexDirection: "column", alignItems: 'start', gap: "0px", padding: '0px' }}>
            <RadioButtons
              options={[
                { value: true, label: 'Show Hidden Songs' },
              ]}
              selectedOption={showHiddenSongs}
              onChange={() => setShowHiddenSongs((prev) => !prev)}
              isCheckbox={true}
            />
            <RadioButtons
              options={[
                { value: true, label: 'Show Developer Filtering Modes' },
              ]}
              selectedOption={showDeveloperFilters}
              onChange={() => setShowDeveloperFilters((prev) => !prev)}
              isCheckbox={true}
            />
          </div>
        </SettingsGroup>
      )}
    </div>
  );
}
