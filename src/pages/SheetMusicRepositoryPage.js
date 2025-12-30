import { useMemo } from 'react';
import '../App.css';
import RadioButtons from '../components/RadioButtons.jsx';
import SettingsGroup from '../components/SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import { useTheme } from '../helpers/theme.jsx';
import songData from '../data/songs.json';
import SheetMusicLink from '../components/SheetMusicLink.js';
import { sortSongs } from '../helpers/sortingAndFiltering.js';

export default function SheetMusicRepositoryPage() {
  const { colorText } = useTheme();

  const songs = useMemo(() => {
    const filteredSongs =  Object.values(songData).filter((song) => song.sheet_music_file);
    const sortedSongs = sortSongs(filteredSongs, 'artist');
    return sortedSongs;
  }, []);

  console.log(songs);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px', overflowY: 'auto' }}>
      {songs.map((song) => (
        <div>
          <SheetMusicLink file={song.sheet_music_file} text={`${song.artist || 'Traditional'} - ${song.title}`}/>
        </div>
      ))}
    </div>
  );
}
