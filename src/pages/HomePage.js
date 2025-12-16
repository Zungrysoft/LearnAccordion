import { NavLink } from 'react-router-dom';
import { useTheme } from '../helpers/theme.jsx';
import { useLessonState } from '../context/LessonStateProvider.jsx';

export default function HomePage() {
  const { colorTextAlt, colorText, filterIcon } = useTheme();
  const { completedLessonCount, totalLessonCount, totalExerciseCount, totalSongCount } = useLessonState();

  const sideBarsStyle = {
    borderLeft: `2px solid ${colorTextAlt}`,
    borderRight: `2px solid ${colorTextAlt}`,
  }

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '16px',
          borderTop: `4px solid ${colorText}`,
          borderBottom: `4px solid ${colorText}`,
        }}
      >
        <div style={{ margin: '8px', padding: '8px', borderRight: `2px solid ${colorTextAlt}` }}>
          <img
            src={`${process.env.PUBLIC_URL}/icon/chromatic.png`}
            alt=""
            style={{
              height: '40px',
              aspectRatio: '3000/477',
              filter: filterIcon,
            }}
          />
        </div>
        <h4 style={{ color: colorText }}>Learn Chromatic Accordion</h4>
        <div style={{ margin: '8px', padding: '8px', borderLeft: `2px solid ${colorTextAlt}` }}>
          <img
            src={`${process.env.PUBLIC_URL}/icon/chromatic.png`}
            alt=""
            style={{
              height: '40px',
              aspectRatio: '3000/477',
              filter: filterIcon,
            }}
          />
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'center', maxWidth: '1920px', margin: 'auto', gap: '16px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '8px', ...sideBarsStyle }}>
            <p style={{ margin: '0px', fontSize: '22px', textAlign: 'center', color: colorText }}>Looking for a structured online course for C-System Chromatic Button Accordion? This free video-based course provides you with lessons, exercises, songs and every other resource you'll need to play your accordion in whatever genres you wish!</p>
          </div>

          <NavLink
            to="/lessons"
            style={{
              margin: '32px',
              border: `2px solid ${colorText}`,
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <h2 style={{ margin: '8px 32px', color: colorText }}>{completedLessonCount === 0 ? "Begin your first lesson!" : "Enter Course"}</h2>
          </NavLink>
        </div>
        <div style={{ flex: 1 }}>
          <img
            src={`${process.env.PUBLIC_URL}/photos/accordion1.png`}
            alt="My accordion"
            style={{
              width: '100%',
              aspectRatio: '3768/2670',
              pointerEvents: 'auto',
            }}
          />
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <p style={{ margin: '0px', fontSize: '18px', color: colorText, width: '100%' }}>{`Features:\n- ${totalSongCount} songs in a wide selection of genres - Polka, Classical, Jazz, covers of Pop and Rock songs, Sea Shanties, Video Game Music, and more!\n- ${totalLessonCount} lessons in technique, music theory, and instrument knowledge.\n- ${totalExerciseCount} exercises with organization tools to set up your daily practice regimen.\n- Daily ear training and sight reading exercises.\n- Structured lesson order while still giving you the freedom to focus on your preferred styles.`}</p>
      </div>
    </div>
  );
}
