import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

export const citizenArchive = pgTable("citizen_archive", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: text("site_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorName: text("author_name").notNull(),
  imageUrl: text("image_url"),
  endorsements: integer("endorsements").default(0).notNull(),
  status: text("status").default("COMMUNITY_CURATING").notNull(),
  exifVerified: boolean("exif_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moderationAuditLogs = pgTable("moderation_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: text("actor_id").notNull(),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(), // e.g. "APPROVED_ARCHIVE", "REJECTED_DAMAGE_REPORT"
  targetId: text("target_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type CitizenArchive = typeof citizenArchive.$inferSelect;
export type NewCitizenArchive = typeof citizenArchive.$inferInsert;
export type ModerationAuditLog = typeof moderationAuditLogs.$inferSelect;
export type NewModerationAuditLog = typeof moderationAuditLogs.$inferInsert;
