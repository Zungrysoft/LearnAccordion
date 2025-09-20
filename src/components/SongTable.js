import '../App.css';
import React,{useState} from 'react';
import songData from '../data/songs.json';
import { sortSongs } from '../helpers/sorting.jsx';
import genreData from '../data/genres.json';
import RadioButtons from './RadioButtons.jsx';
import { useTheme } from '../helpers/theme.jsx';

const HeaderGroup = ({ title, scale, children }) => {
  const headerItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: scale,
  }

  const containerStyle = {
    padding: '8px',
    border: "2px solid white",
    borderRadius: '10px',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    gap: '16px',
  }

  return (
    
    <div style={headerItemStyle}>
      <h2 style={{ color: 'white', margin: '8px' }}>{title}</h2>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  )
}

const SongTable = ({ state, onOpenPage }) => {
  const songs = Object.entries(songData).map(([key, value]) => ({...value, id: key}));
  const [sortMode, setSortMode] = useState('0');
  const [filterHandsMode, setFilterHandsMode] = useState('any');
  const [filterVocalsMode, setFilterVocalsMode] = useState('any');
  const [filterLockedSongsMode, setFilterLockedSongsMode] = useState('hide-locked');
  const { colorBackground, colorBackgroundLocked, colorBackgroundCompleted } = useTheme();

  let filteredSongs = songs;
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

  const sortedSongs = sortSongs(filteredSongs, Number(sortMode));

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
    borderTop: "2px solid white",
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
    borderBottom: "2px solid white",
    padding: "8px",
    color: "#eee",
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={headerStyle}>
        <HeaderGroup title="Filter Songs" scale={2}>
          <RadioButtons
            options={[
              {value: 'one-handed', label: 'One-handed songs only'},
              {value: 'two-handed', label: 'Two-handed songs only'},
              {value: 'any', label: 'Show both'},
            ]}
            selectedOption={filterHandsMode}
            onChange={setFilterHandsMode}
          />
          <RadioButtons
            options={[
              {value: 'only-vocals', label: 'Songs with vocals'},
              {value: 'no-vocals', label: 'Songs without vocals'},
              {value: 'any', label: 'Show both'},
            ]}
            selectedOption={filterVocalsMode}
            onChange={setFilterVocalsMode}
          />
          <RadioButtons
            options={[
              {value: 'hide-locked', label: 'Hide locked songs'},
              {value: 'show-locked', label: 'Show locked songs'},
            ]}
            selectedOption={filterLockedSongsMode}
            onChange={setFilterLockedSongsMode}
          />
        </HeaderGroup>
        <HeaderGroup title="Sort Songs" scale={1}>
          <RadioButtons
             options={[
              {value: '0', label: 'Genre'},
              {value: '1', label: 'Points'},
            ]}
            selectedOption={sortMode}
            onChange={setSortMode}
          />
          <RadioButtons
             options={[
              {value: '3', label: 'Title'},
              {value: '2', label: 'Artist/Origin'},
            ]}
            selectedOption={sortMode}
            onChange={setSortMode}
          />
        </HeaderGroup>
        
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <tbody>
            {sortedSongs.map((song, index) => (
              <tr
                key={index}
                style={{
                  cursor: 'pointer',
                  backgroundColor: state[song.id]?.completed ? colorBackgroundCompleted : colorBackground,
                }}
                onClick={() => onOpenPage(song.id)}
              >
                <td style={tdStyle}>
                  <SongTitle title={song.title} pinned={state[song.id]?.pinned}/>
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
    </div>
  );
};

export default SongTable;


function SongTitle({ title, pinned }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
            {pinned && (
              <img
                  src={`${process.env.PUBLIC_URL}/icon/pin.png`}
                  alt=""
                  style={{
                      width: '16px',
                      height: '16px',
                      filter: 'invert(1)',
                  }}
              />
            )}
            <h2 style={{ fontSize: 20, margin: 0, color: 'white'}}>
                {title}
            </h2>
        </div>
    );
}

function SongArtist({ artist }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
            <h2 style={{ fontSize: 20, margin: 0, color: 'white' }}>
                {artist || "Traditional"}
            </h2>
        </div>
    );
}

const detailsBoxStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end', gap: '4px' };

function SongDetails({ hasLyrics, points, isTwoHanded }) {
    const hasPoints = !!(points && points >= 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
            <div style={{...detailsBoxStyle, width: '45px'}}>
              {hasPoints && (
                  <>
                    <h2 style={{ color: 'white', fontSize: 18, margin: 0}}>{points}</h2>
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/star.png`}
                        alt=""
                        style={{
                            width: '18px',
                            height: '18px',
                            filter: 'invert(1)',
                        }}
                    />
                  </>
              )}
            </div>
            <div style={{...detailsBoxStyle, width: '30px'}}>
              {isTwoHanded && (
                  <img
                      src={`${process.env.PUBLIC_URL}/icon/two_hands.png`}
                      alt=""
                      style={{
                          width: '24px',
                          height: '24px',
                          filter: 'invert(1)',
                      }}
                  />
              )}
            </div>
            <div style={{...detailsBoxStyle, width: '30px'}}>
              {hasLyrics && (
                  <img
                      src={`${process.env.PUBLIC_URL}/icon/microphone2.png`}
                      alt=""
                      style={{
                          width: '24px',
                          height: '24px',
                          filter: 'invert(1)',
                      }}
                  />
              )}
            </div>
        </div>
    );
}

function GenreIndicator({ genre }) {
    if (!genre) {
        return null;
    }

    let { display, icon } = genreData[genre?.toLowerCase()];

    if (!display) {
        return null;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end', gap: '16px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 'normal', fontStyle: 'italic', color: 'white' }}>{display}</h2>
            {icon && (
                <img
                    src={`${process.env.PUBLIC_URL}/icon/${icon}.png`}
                    alt=""
                    style={{
                        width: '36px',
                        height: '36px',
                        filter: 'invert(1)',
                    }}
                />
            )}
        </div>
    );
}
