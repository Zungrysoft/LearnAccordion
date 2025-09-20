import '../App.css';
import React, { useState } from 'react';
import songData from '../data/songs.json';
import { sortSongs } from '../helpers/sorting.jsx';
import genreData from '../data/genres.json';
import RadioButtons from './RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';
import SettingsGroup from './SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';

const SettingsPage = () => {
  const { theme, setTheme } = useSettings();

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
    </div>
  );
}

export default SettingsPage;
