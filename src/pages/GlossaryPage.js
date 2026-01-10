import '../App.css';
import glossaryData from '../data/glossary.json';
import { useTheme } from '../helpers/theme';

const glossaryDataSorted = glossaryData.filter((entry) => entry.term).sort((a, b) => {
  if (a.term < b.term) {
    return -1;
  }
  if (a.term > b.term) {
    return 1;
  }
  return 0;
})

export default function GlossaryPage() {
  const { colorText } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflowY: 'auto' }}>
      {glossaryDataSorted.map((entry) => (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1920px' }}>
          <h2
            id={entry.term.toLowerCase().replaceAll(' ', '_')}
            style={{ userSelect: "auto", color: colorText, textAlign: 'left', padding: '12px', margin: '0px' }}
          >
            {entry.term}
          </h2>
          <p
            style={{ color: colorText, margin: '0px', marginLeft: '24px', marginBottom: '16px', marginRight: '12px', width: 'auto', textAlign: 'justify' }}
          >
            <TextWithLinks text={entry.definition}/>
          </p>
        </div>
      ))}
    </div>
  );
}

function TextWithLinks({ text }) {
  const { colorTextLink } = useTheme();

  const parts = text.split('*');

  return parts.map((part, index) => {
    let partText = part;
    let partLink = part;
    if (part.includes('|')) {
      [partText, partLink] = part.split('|');
    }
    else if (part.includes('+')) {
      partLink = part.split('+')[0];
      partText = part.replace('+', '')
    }

    if (index % 2 === 1) {
      const id = partLink.toLowerCase().replaceAll(' ', '_');
      return (
        <a key={index} href={`#${id}`} style={{ color: colorTextLink }}>
          {partText}
        </a>
      );
    }
    return part;
  });
}
