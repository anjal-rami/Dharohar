// scripts/sync_culinary.js
import fs from 'fs';

const culinaryEntries = JSON.parse(fs.readFileSync('src/data/culinary_seed.json', 'utf8'));

const paths = ['src/data/categories_seed.json', 'app/data/categories_seed.json'];

for (const p of paths) {
  if (fs.existsSync(p)) {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    // Filter out existing culinary
    const nonCulinary = raw.filter(item => item.category !== 'culinary');
    
    // Find index of first crafts item or insert after performing_arts
    const craftsIndex = nonCulinary.findIndex(item => item.category === 'crafts');
    const insertIndex = craftsIndex >= 0 ? craftsIndex : nonCulinary.length;
    
    nonCulinary.splice(insertIndex, 0, ...culinaryEntries);
    
    fs.writeFileSync(p, JSON.stringify(nonCulinary, null, 2), 'utf8');
    console.log(`[OK] Successfully updated ${p} with ${culinaryEntries.length} culinary entries including cooking techniques.`);
  }
}
