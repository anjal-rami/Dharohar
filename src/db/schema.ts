import { pgTable, text, timestamp, integer, jsonb, uuid, geometry } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users & Auth
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["visitor", "contributor", "moderator", "admin"] })
    .default("visitor")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Heritage Sites with PostGIS coordinates
export const heritageSites = pgTable("heritage_sites", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  // PostGIS Point geometry: Point(Longitude, Latitude), SRID 4326 (WGS 84)
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
  preservationStatus: text("preservation_status", {
    enum: ["safe", "attention", "risk", "restoration"],
  })
    .default("safe")
    .notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  panoramaUrl: text("panorama_url"),
  model3dUrl: text("model_3d_url"), // Ready for AR
  verifiedSource: text("verified_source").default("ASI").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Heritage Trails
export const trails = pgTable("trails", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  hubCity: text("hub_city").notNull(),
  travelMode: text("travel_mode", { enum: ["walk", "cycle", "car", "transit"] }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  distanceKm: integer("distance_km").notNull(),
  stopSiteIds: jsonb("stop_site_ids").$type<string[]>().notNull(),
});

// Citizen Archive Submissions
export const citizenArchives = pgTable("citizen_archives", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  state: text("state").notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id),
  mediaUrls: jsonb("media_urls").$type<string[]>().notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .default("pending")
    .notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  reputationScore: integer("reputation_score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Citizen Archive and Moderation Audit Logs
export {
  citizenArchive,
  moderationAuditLogs,
  type CitizenArchive,
  type NewCitizenArchive,
  type ModerationAuditLog,
  type NewModerationAuditLog,
} from "../server/schema";
