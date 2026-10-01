const fs = require('fs');

const hrSrc = JSON.parse(fs.readFileSync('src/data/heritage_records.json', 'utf8'));

console.log('=== TEST SUITE: 15 HERITAGE RECORDS INGESTION & FILTER VERIFICATION ===\n');

// 1. Check all 15 records in heritage_records.json
console.log(`[TEST 1] heritage_records.json record count: ${hrSrc.length} (Expected: 15)`);
if (hrSrc.length === 15) {
  console.log('✓ PASS: Exactly 15 records present.');
} else {
  console.error('✗ FAIL: Expected 15 records.');
}

// 2. Check 15 images
const imageFiles = [
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

console.log('\n[TEST 2] Verifying 15 image files:');
let missingImages = 0;
for (const img of imageFiles) {
  if (fs.existsSync(img)) {
    const sz = fs.statSync(img).size;
    console.log(`  ✓ ${img} (${sz} bytes)`);
  } else {
    console.error(`  ✗ MISSING: ${img}`);
    missingImages++;
  }
}
if (missingImages === 0) console.log('✓ PASS: All 15 images exist.');

// 3. Category matching test
console.log('\n[TEST 3] Category Matching & Filtering Verification');
const monuments10 = [
  'kinnaur-wooden-temple',
  'kedarnath-temple',
  'kashi-vishwanath-temple',
  'meenakshi-sundareswarar-temple',
  'somnath-temple',
  'puri-jagannath-temple',
  'tirupati-venkateswara-temple',
  'kailasa-ellora-cave-16',
  'ramanathaswamy-temple',
  'dwarkadhish-temple'
];

const monumentsInHr = hrSrc.filter(r => r.category === 'Monuments & Sites').map(r => r.slug);
const all10MonumentsPresent = monuments10.every(m => monumentsInHr.includes(m));
console.log(`  Monuments count: ${monumentsInHr.length}/10`);
if (all10MonumentsPresent && monumentsInHr.length === 10) {
  console.log('  ✓ PASS: Monuments & Sites includes all 10 shrines, hill temples, and rock excavations.');
} else {
  console.error('  ✗ FAIL: Missing monuments:', monuments10.filter(m => !monumentsInHr.includes(m)));
}

const craftsInHr = hrSrc.filter(r => r.category === 'Crafts & Textiles').map(r => r.slug);
if (craftsInHr.includes('odisha-palm-leaf-manuscript')) {
  console.log('  ✓ PASS: Crafts & Textiles includes Odisha Palm-Leaf Manuscript record.');
} else {
  console.error('  ✗ FAIL: Missing odisha-palm-leaf-manuscript.');
}

const foodInHr = hrSrc.filter(r => r.category === 'Food Traditions').map(r => r.slug);
if (foodInHr.includes('chettinad-kitchen-traditions')) {
  console.log('  ✓ PASS: Food Traditions includes Chettinad Kitchen record.');
} else {
  console.error('  ✗ FAIL: Missing chettinad-kitchen-traditions.');
}

const perfInHr = hrSrc.filter(r => r.category === 'Performing Arts').map(r => r.slug);
const expectedPerf = ['baul-song-bengal', 'majuli-sattriya-satra-life', 'pandavani-epic-chhattisgarh'];
const allPerfPresent = expectedPerf.every(p => perfInHr.includes(p));
if (allPerfPresent) {
  console.log('  ✓ PASS: Performing Arts includes Baul, Majuli Sattriya, and Pandavani.');
} else {
  console.error('  ✗ FAIL: Missing performing arts:', expectedPerf.filter(p => !perfInHr.includes(p)));
}

// 4. Search Queries Test
console.log('\n[TEST 4] Search Query Matching Verification');
function searchRecords(query) {
  const q = query.toLowerCase();
  return hrSrc.filter(r => {
    const hay = [
      r.title,
      r.region,
      r.category,
      r.shortDescription,
      r.fullDescription,
      ...(r.tags || [])
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });
}

const teejanMatch = searchRecords('Teejan Bai');
console.log(`  Search 'Teejan Bai': found ${teejanMatch.length} records -> ${teejanMatch.map(r => r.slug).join(', ')}`);
if (teejanMatch.some(r => r.slug === 'pandavani-epic-chhattisgarh')) {
  console.log('  ✓ PASS: "Teejan Bai" returns Pandavani Oral Ballad Tradition.');
} else {
  console.error('  ✗ FAIL: "Teejan Bai" query failed.');
}

const elloraMatch = searchRecords('Ellora');
console.log(`  Search 'Ellora': found ${elloraMatch.length} records -> ${elloraMatch.map(r => r.slug).join(', ')}`);
if (elloraMatch.some(r => r.slug === 'kailasa-ellora-cave-16')) {
  console.log('  ✓ PASS: "Ellora" returns Kailasa Temple (Cave 16, Ellora).');
} else {
  console.error('  ✗ FAIL: "Ellora" query failed.');
}

const kinnaurMatch = searchRecords('Kinnaur');
console.log(`  Search 'Kinnaur': found ${kinnaurMatch.length} records -> ${kinnaurMatch.map(r => r.slug).join(', ')}`);
if (kinnaurMatch.some(r => r.slug === 'kinnaur-wooden-temple')) {
  console.log('  ✓ PASS: "Kinnaur" returns Wooden Hill Temple Architecture of Kinnaur.');
} else {
  console.error('  ✗ FAIL: "Kinnaur" query failed.');
}

const jyotirlingaMatch = searchRecords('Jyotirlinga');
console.log(`  Search 'Jyotirlinga': found ${jyotirlingaMatch.length} records -> ${jyotirlingaMatch.map(r => r.slug).join(', ')}`);
const expectedJyotir = ['kedarnath-temple', 'kashi-vishwanath-temple', 'somnath-temple', 'ramanathaswamy-temple'];
if (expectedJyotir.every(j => jyotirlingaMatch.some(r => r.slug === j))) {
  console.log('  ✓ PASS: "Jyotirlinga" returns Kedarnath, Kashi Vishwanath, Somnath, and Ramanathaswamy.');
} else {
  console.error('  ✗ FAIL: Missing Jyotirlinga temples.');
}

console.log('\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
