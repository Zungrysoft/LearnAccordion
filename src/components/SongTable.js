import '../App.css';
import React, { useCallback, useState } from 'react';
import songData from '../data/songs.json';
import { sortSongs } from '../helpers/sorting.jsx';
import genreData from '../data/genres.json';
import RadioButtons from './RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';
import SettingsGroup from './SettingsGroup.js';
import { useSettings } from '../context/SettingsProvider.jsx';
import TextInput from './TextInput.js';

function processForFilter(text) {
  return text.toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll('é', 'e')
    .replaceAll('è', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ñ', 'n')
    .replaceAll('-', '')
    .replaceAll('\'', '')
    .replaceAll(',', '')
    .replaceAll('.', '')
  ;
}

const SongTable = ({ state, onOpenPage }) => {
  const songs = Object.entries(songData).map(([key, value]) => ({ ...value, id: key }));
  const {
    songSortMode,
    setSongSortMode,
    filterHandsMode,
    setFilterHandsMode,
    filterVocalsMode,
    setFilterVocalsMode,
    showLockedSongs,
    setShowLockedSongs,
    showHiddenSongs,
    setShowHiddenSongs,
  } = useSettings();
  const [filterText, setFilterText] = useState("");
  const { colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight, colorText } = useTheme();

  const isSongUnlocked = useCallback((song) => {
    if (!song.requirements) {
      return true;
    }

    for (const requirement of song.requirements) {
      let satisfied = false
      for (const option of requirement) {
        if (state[option]?.completed) {
          satisfied = true;
          break;
        }
      }
      if (!satisfied) {
        return false;
      }
    }
    return true;
  }, [state])

  const getSongBackgroundColor = useCallback((song) => {
    if (song.is_hidden) {
      return colorBackgroundDarker;
    }
    if (state[song.id]?.completed) {
      return colorBackgroundLight;
    }
    if (isSongUnlocked(song)) {
      return colorBackground;
    }
    return colorBackgroundDark;
  }, [state, isSongUnlocked, colorBackground, colorBackgroundDark, colorBackgroundDarker, colorBackgroundLight]);

  let filteredSongs = songs;
  if (!showHiddenSongs) {
    filteredSongs = filteredSongs.filter((song) => !song.is_hidden)
  }
  if (!showLockedSongs) {
    filteredSongs = filteredSongs.filter((song) => isSongUnlocked(song))
  }
  const noSongsUnlocked = filteredSongs.length === 0;
  if (filterHandsMode === 'one-handed') {
    filteredSongs = filteredSongs.filter((song) => !song.is_two_handed)
  }
  if (filterHandsMode === 'two-handed') {
    filteredSongs = filteredSongs.filter((song) => song.is_two_handed)
  }
  if (filterVocalsMode === 'only-vocals') {
    filteredSongs = filteredSongs.filter((song) => song.has_vocals)
  }
  if (filterVocalsMode === 'no-vocals') {
    filteredSongs = filteredSongs.filter((song) => !song.has_vocals)
  }
  if (filterText.length > 0) {
    filteredSongs = filteredSongs.filter((song) => {
      for (const filterWord of filterText.split(" ")) {
        const fw = processForFilter(filterWord);

        if (!(
          processForFilter(song.title).includes(fw) ||
          processForFilter(song.artist || "Traditional").includes(fw) ||
          processForFilter(genreData[song.genre].display).includes(fw)
        )) {
          return false;
        }
      }
      return true;
    })
  }

  const sortedSongs = sortSongs(filteredSongs, songSortMode);

  // Then sort again by pinned
  sortedSongs.sort((a, b) => {
    // Sort pinned lessons at the top
    if (state[a.id]?.pinned && !state[b.id]?.pinned) {
      return -1;
    }
    if (state[b.id]?.pinned && !state[a.id]?.pinned) {
      return 1;
    }

    // Sort completed lessons at the end
    if (state[a.id]?.completed && !state[b.id]?.completed) {
      return 1;
    }
    if (state[b.id]?.completed && !state[a.id]?.completed) {
      return -1;
    }

    // Keep the same sort order otherwise
    return 0;
  })

  const tableContainerStyle = {
    maxHeight: "100%",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    borderTop: `2px solid ${colorText}`,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'row',
    padding: '8px',
    gap: '8px',
  };

  const tdStyle = {
    borderBottom: `2px solid ${colorText}`,
    padding: "8px",
    color: "#eee",
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={headerStyle}>
        <SettingsGroup title="Filter Songs" scale={2}>
          <RadioButtons
            options={[
              { value: 'one-handed', label: 'One-handed songs only' },
              { value: 'two-handed', label: 'Two-handed songs only' },
            ]}
            selectedOption={filterHandsMode}
            onChange={(value) => setFilterHandsMode((prev) => prev === value ? null : value)}
            isCheckbox
          />
          <RadioButtons
            options={[
              { value: 'only-vocals', label: 'Songs with vocals only' },
              { value: 'no-vocals', label: 'Songs without vocals only' },
            ]}
            selectedOption={filterVocalsMode}
            onChange={(value) => setFilterVocalsMode((prev) => prev === value ? null : value)}
            isCheckbox
          />
          <RadioButtons
            options={[
              { value: true, label: 'Show locked songs' },
            ]}
            selectedOption={showLockedSongs}
            onChange={() => setShowLockedSongs((prev) => !prev)}
            isCheckbox
          />
          <TextInput
            value={filterText}
            onChange={setFilterText}
            onClear={() => setFilterText("")}
            placeholder="Search"
          />
        </SettingsGroup>
        <SettingsGroup title="Sort Songs" scale={1}>
          <RadioButtons
            options={[
              { value: 'genre', label: 'Genre' },
              { value: 'points', label: 'Points' },
            ]}
            selectedOption={songSortMode}
            onChange={setSongSortMode}
          />
          <RadioButtons
            options={[
              { value: 'title', label: 'Title' },
              { value: 'artist', label: 'Artist/Origin' },
            ]}
            selectedOption={songSortMode}
            onChange={setSongSortMode}
          />
        </SettingsGroup>

      </div>

      {
        sortedSongs.length > 0 ?
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <tbody>
                {sortedSongs.map((song, index) => (
                  <tr
                    key={index}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: getSongBackgroundColor(song),
                    }}
                    onClick={() => onOpenPage(song.id)}
                  >
                    <td style={tdStyle}>
                      <SongTitle title={song.title} pinned={state[song.id]?.pinned} completed={state[song.id]?.completed} />
                    </td>
                    <td style={tdStyle}>
                      <SongArtist artist={song.artist} />
                    </td>
                    <td style={tdStyle}>
                      <SongDetails
                        hasLyrics={song.has_vocals}
                        points={song.points}
                        isTwoHanded={song.is_two_handed}
                      />
                    </td>
                    <td style={tdStyle}><GenreIndicator genre={song.genre} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <div style={tableContainerStyle}>
            <p style={{ textAlign: "center", verticalAlign: "center" }}>{noSongsUnlocked ? "You have not unlocked any songs yet. Mark lessons as complete in the 'Lessons' tab to unlock more songs." : "There are no songs that match your filters."}</p>
          </div>

      }
      
    </div>
  );
};

export default SongTable;


function SongTitle({ title, pinned, completed }) {
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
      <h2 style={{ fontSize: 20, margin: 0, color: colorText }}>
        {title}
      </h2>
    </div>
  );
}

function SongArtist({ artist }) {
  const { colorText } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
      <h2 style={{ fontSize: 20, margin: 0, color: colorText }}>
        {artist || "Traditional"}
      </h2>
    </div>
  );
}

const detailsBoxStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end', gap: '4px' };

function SongDetails({ hasLyrics, points, isTwoHanded }) {
  const { colorText, filterIcon } = useTheme();
  const hasPoints = !!(points && points >= 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
      <div style={{ ...detailsBoxStyle, width: '45px' }}>
        {hasPoints && (
          <>
            <h2 style={{ color: colorText, fontSize: 18, margin: 0 }}>{points}</h2>
            <img
              src={`${process.env.PUBLIC_URL}/icon/star.png`}
              alt=""
              style={{
                width: '18px',
                height: '18px',
                filter: filterIcon,
              }}
            />
          </>
        )}
      </div>
      <div style={{ ...detailsBoxStyle, width: '30px' }}>
        {isTwoHanded && (
          <img
            src={`${process.env.PUBLIC_URL}/icon/two_hands.png`}
            alt=""
            style={{
              width: '24px',
              height: '24px',
              filter: filterIcon,
            }}
          />
        )}
      </div>
      <div style={{ ...detailsBoxStyle, width: '30px' }}>
        {hasLyrics && (
          <img
            src={`${process.env.PUBLIC_URL}/icon/microphone2.png`}
            alt=""
            style={{
              width: '24px',
              height: '24px',
              filter: filterIcon,
            }}
          />
        )}
      </div>
    </div>
  );
}

function GenreIndicator({ genre }) {
  const { colorText, filterIcon } = useTheme();

  if (!genre) {
    return null;
  }

  let { display, icon } = genreData[genre?.toLowerCase()];

  if (!display) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end', gap: '16px' }}>
      <h2 style={{ fontSize: 16, fontWeight: 'normal', fontStyle: 'italic', color: colorText }}>{display}</h2>
      {icon && (
        <img
          src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
          alt=""
          style={{
            width: '36px',
            height: '36px',
            filter: filterIcon,
          }}
        />
      )}
    </div>
  );
}
