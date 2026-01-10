import '../App.css';
import { useTheme } from '../helpers/theme.jsx';

export default function AboutPage() {
  const { colorText } = useTheme();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px', overflowY: 'auto', alignItems: 'center' }}>
      <div style={{ maxWidth: '1920px' }}>
        <h2 style={{ color: colorText }}>About LearnAccordion.com</h2>
        <p style={{ color: colorText }}>{`Hi, I'm Calvin. I am creating LearnAccordion.com as a set of tools to learn Piano Accordion and C-System Chromatic Button Accordion. Right now the website is mostly just a repository for sheet music of accordion arrangements, but I have plans for more features in the future.\n\nThanks for stopping by!`}</p>
      </div>
    </div>
  );
}
