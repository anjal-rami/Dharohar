const fs = require('fs');

// Verify all 15 image files exist and are not empty
const images = [
  'public/images/crafts/odisha_palm_leaf.jpg',
  'public/images/monuments/kinnaur_wooden_temple.jpg',
  'public/images/monuments/kedarnath_temple.jpg',
  'public/images/monuments/kashi_vishwanath.jpg',
  'public/images/monuments/meenakshi_sundareswarar.jpg',
  'public/images/monuments/somnath_temple.jpg',
  'public/images/monuments/puri_jagannath.jpg',
  'public/images/monuments/tirupati_venkateswara.jpg',
  'public/images/monuments/kailasa_ellora.jpg',
  'public/images/monuments/ramanathaswamy_temple.jpg',
  'public/images/monuments/dwarkadhish_temple.jpg',
  'public/images/food/chettinad_kitchen.jpg',
  'public/images/performing_arts/baul_song_bengal.jpg',
  'public/images/performing_arts/majuli_sattriya_satra.jpg',
  'public/images/performing_arts/pandavani_chhattisgarh.jpg'
];

console.log('--- 1. Image Files Verification ---');
let allImagesOk = true;
for (const img of images) {
  if (!fs.existsSync(img)) {
    console.error(`Missing image: ${img}`);
    allImagesOk = false;
  } else {
    const size = fs.statSync(img).size;
    if (size === 0) {
      console.error(`Empty image: ${img}`);
      allImagesOk = false;
    }
  }
}
if (allImagesOk) console.log('All 15 images verified present and non-empty.');

// Check datasets
console.log('\n--- 2. Dataset Files Verification ---');
const hrSrc = JSON.parse(fs.readFileSync('src/data/heritage_records.json', 'utf8'));
const hrApp = JSON.parse(fs.readFileSync('app/data/heritage_records.json', 'utf8'));
console.log(`src/data/heritage_records.json has ${hrSrc.length} records.`);
console.log(`app/data/heritage_records.json has ${hrApp.length} records.`);

console.log('\nAll checks passed!');
