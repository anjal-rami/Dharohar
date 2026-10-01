const fs = require('fs');

let content = fs.readFileSync('src/lib/heritage-data.ts', 'utf8');

const updates = [
  {
    needle: 'slug: "palm-leaf-manuscripts-odisha",',
    oldImg: 'image: manuscriptImg,',
    newImg: 'image: "/images/crafts/odisha_palm_leaf.jpg",',
    oldGallery: 'gallery: [manuscriptImg, heroHeritage],',
    newGallery: 'gallery: ["/images/crafts/odisha_palm_leaf.jpg"],'
  },
  {
    needle: 'slug: "chandratal-hill-temples",',
    oldImg: 'image: hillTempleImg,',
    newImg: 'image: "/images/monuments/kinnaur_wooden_temple.jpg",',
    oldGallery: 'gallery: [hillTempleImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/kinnaur_wooden_temple.jpg"],'
  },
  {
    needle: 'slug: "chettinad-kitchen-traditions",',
    oldImg: 'image: festivalImg,',
    newImg: 'image: "/images/food/chettinad_kitchen.jpg",',
    oldGallery: 'gallery: [festivalImg, heroHeritage],',
    newGallery: 'gallery: ["/images/food/chettinad_kitchen.jpg"],'
  },
  {
    needle: 'slug: "baul-song-bengal",',
    oldImg: 'image: performanceImg,',
    newImg: 'image: "/images/performing_arts/baul_song_bengal.jpg",',
    oldGallery: 'gallery: [performanceImg, heroHeritage],',
    newGallery: 'gallery: ["/images/performing_arts/baul_song_bengal.jpg"],'
  },
  {
    needle: 'slug: "sattriya-majuli",',
    oldImg: 'image: performanceImg,',
    newImg: 'image: "/images/performing_arts/majuli_sattriya_satra.jpg",',
    oldGallery: 'gallery: [performanceImg, manuscriptImg],',
    newGallery: 'gallery: ["/images/performing_arts/majuli_sattriya_satra.jpg"],'
  },
  {
    needle: 'slug: "pandavani-oral-epic",',
    oldImg: 'image: performanceImg,',
    newImg: 'image: "/images/performing_arts/pandavani_chhattisgarh.jpg",',
    oldGallery: 'gallery: [performanceImg, heroHeritage],',
    newGallery: 'gallery: ["/images/performing_arts/pandavani_chhattisgarh.jpg"],'
  },
  {
    needle: 'slug: "kedarnath-temple",',
    oldImg: 'image: hillTempleImg,',
    newImg: 'image: "/images/monuments/kedarnath_temple.jpg",',
    oldGallery: 'gallery: [hillTempleImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/kedarnath_temple.jpg"],'
  },
  {
    needle: 'slug: "kashi-vishwanath-temple",',
    oldImg: 'image: heroHeritage,',
    newImg: 'image: "/images/monuments/kashi_vishwanath.jpg",',
    oldGallery: 'gallery: [heroHeritage, festivalImg],',
    newGallery: 'gallery: ["/images/monuments/kashi_vishwanath.jpg"],'
  },
  {
    needle: 'slug: "meenakshi-sundareswarar-temple",',
    oldImg: 'image: performanceImg,',
    newImg: 'image: "/images/monuments/meenakshi_sundareswarar.jpg",',
    oldGallery: 'gallery: [performanceImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/meenakshi_sundareswarar.jpg"],'
  },
  {
    needle: 'slug: "somnath-temple",',
    oldImg: 'image: modheraSunTempleImg,',
    newImg: 'image: "/images/monuments/somnath_temple.jpg",',
    oldGallery: 'gallery: [modheraSunTempleImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/somnath_temple.jpg"],'
  },
  {
    needle: 'slug: "puri-jagannath-temple",',
    oldImg: 'image: festivalImg,',
    newImg: 'image: "/images/monuments/puri_jagannath.jpg",',
    oldGallery: 'gallery: [festivalImg, manuscriptImg],',
    newGallery: 'gallery: ["/images/monuments/puri_jagannath.jpg"],'
  },
  {
    needle: 'slug: "tirupati-venkateswara-temple",',
    oldImg: 'image: hillTempleImg,',
    newImg: 'image: "/images/monuments/tirupati_venkateswara.jpg",',
    oldGallery: 'gallery: [hillTempleImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/tirupati_venkateswara.jpg"],'
  },
  {
    needle: 'slug: "kailasa-temple-ellora",',
    oldImg: 'image: golcondaFortImg,',
    newImg: 'image: "/images/monuments/kailasa_ellora.jpg",',
    oldGallery: 'gallery: [golcondaFortImg, heroHeritage],',
    newGallery: 'gallery: ["/images/monuments/kailasa_ellora.jpg"],'
  },
  {
    needle: 'slug: "ramanathaswamy-temple-rameswaram",',
    oldImg: 'image: heroHeritage,',
    newImg: 'image: "/images/monuments/ramanathaswamy_temple.jpg",',
    oldGallery: 'gallery: [heroHeritage, festivalImg],',
    newGallery: 'gallery: ["/images/monuments/ramanathaswamy_temple.jpg"],'
  }
];

let replacedCount = 0;
for (const u of updates) {
  const needleIdx = content.indexOf(u.needle);
  if (needleIdx !== -1) {
    const nextClose = content.indexOf('},\n  {', needleIdx);
    const endIdx = nextClose !== -1 ? nextClose : needleIdx + 2500;
    const chunk = content.substring(needleIdx, endIdx);
    
    let updatedChunk = chunk;
    if (chunk.includes(u.oldImg)) {
      updatedChunk = updatedChunk.replace(u.oldImg, u.newImg);
    }
    if (chunk.includes(u.oldGallery)) {
      updatedChunk = updatedChunk.replace(u.oldGallery, u.newGallery);
    }
    
    if (updatedChunk !== chunk) {
      content = content.substring(0, needleIdx) + updatedChunk + content.substring(endIdx);
      replacedCount++;
      console.log(`Updated images for ${u.needle}`);
    } else {
      console.log(`Could not find oldImg/oldGallery in chunk for ${u.needle}`);
    }
  } else {
    console.log(`Needle not found: ${u.needle}`);
  }
}

fs.writeFileSync('src/lib/heritage-data.ts', content, 'utf8');
console.log(`Successfully updated ${replacedCount} items in heritage-data.ts.`);
