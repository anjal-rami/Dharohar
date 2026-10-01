const fs = require('fs');

const content = fs.readFileSync('src/lib/heritage-data.ts', 'utf8');
const slugs = [
  'kedarnath-temple',
  'kashi-vishwanath-temple',
  'meenakshi-sundareswarar-temple',
  'somnath-temple',
  'puri-jagannath-temple',
  'tirupati-venkateswara-temple',
  'kailasa-temple-ellora',
  'ramanathaswamy-temple-rameswaram',
  'palm-leaf-manuscripts-odisha',
  'chandratal-hill-temples',
  'chettinad-kitchen-traditions',
  'baul-song-bengal',
  'sattriya-majuli',
  'pandavani-oral-epic'
];

for (const s of slugs) {
  const needle = `slug: "${s}"`;
  const idx = content.indexOf(needle);
  if (idx !== -1) {
    const chunk = content.substring(idx, idx + 2500);
    const lines = chunk.split('\n');
    const imgLine = lines.find(l => l.trim().startsWith('image:'));
    console.log(`${s} -> ${imgLine ? imgLine.trim() : 'NO image LINE FOUND'}`);
  } else {
    console.log(`${s} -> NOT FOUND`);
  }
}
