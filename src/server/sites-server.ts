import { db } from "./db";
import { citizenArchive } from "./schema";
import localSitesCache from "../data/heritage_sites_seed.json";

export async function fetchHomeData() {
  try {
    if (db) {
      const results = await db.select().from(citizenArchive).limit(20);
      if (results && results.length > 0) return results;
    }
  } catch (err) {
    console.warn("[DB Fallback]: Using pre-compiled offline cache.", err);
  }
  return localSitesCache;
}
