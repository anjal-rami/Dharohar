const fs = require('fs');
const path = require('path');

const mappings = [
  { src: 'Palm-Leaf Manuscript from Odisha.jpg', dest: 'public/images/crafts/odisha_palm_leaf.jpg' },
  { src: 'Wooden hill temple of Kinnaur.jpg', dest: 'public/images/monuments/kinnaur_wooden_temple.jpg' },
  { src: 'Kedarnath Temple.jpg', dest: 'public/images/monuments/kedarnath_temple.jpg' },
  { src: 'Kashi Vishwanath Temple.jpg', dest: 'public/images/monuments/kashi_vishwanath.jpg' },
  { src: 'Meenakshi Sundareswarar Temple.jpg', dest: 'public/images/monuments/meenakshi_sundareswarar.jpg' },
  { src: 'Somnath Temple.jpg', dest: 'public/images/monuments/somnath_temple.jpg' },
  { src: 'Puri Jagannath Temple.jpg', dest: 'public/images/monuments/puri_jagannath.jpg' },
  { src: 'Tirupati Venkateswara Temple.jpg', dest: 'public/images/monuments/tirupati_venkateswara.jpg' },
  { src: 'Kailasa Temple (Cave 16, Ellora).jpg', dest: 'public/images/monuments/kailasa_ellora.jpg' },
  { src: 'Ramanathaswamy Temple.jpg', dest: 'public/images/monuments/ramanathaswamy_temple.jpg' },
  { src: 'Dwarka Temple.jpg', dest: 'public/images/monuments/dwarkadhish_temple.jpg' },
  { src: 'Chettinad kitchen traditions.jpg', dest: 'public/images/food/chettinad_kitchen.jpg' },
  { src: 'Baul song of Bengal.jpg', dest: 'public/images/performing_arts/baul_song_bengal.jpg' },
  { src: 'Sattriya and satra life, Majuli.jpg', dest: 'public/images/performing_arts/majuli_sattriya_satra.jpg' },
  { src: 'Pandavani oral epic, Chhattisgarh.jpg', dest: 'public/images/performing_arts/pandavani_chhattisgarh.jpg' }
];

const srcDir = path.resolve('Remaining Images');

for (const m of mappings) {
  const fromPath = path.join(srcDir, m.src);
  const toPath = path.resolve(m.dest);
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.copyFileSync(fromPath, toPath);
  const stat = fs.statSync(toPath);
  console.log(`Copied ${m.src} -> ${m.dest} (${stat.size} bytes)`);
}

console.log('All 15 images copied successfully.');
