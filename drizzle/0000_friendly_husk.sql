CREATE TABLE "citizen_archives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"state" text NOT NULL,
	"submitted_by" uuid,
	"media_urls" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"reputation_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "heritage_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"state" text NOT NULL,
	"description" text NOT NULL,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
	"location" geometry(point),
	"preservation_status" text DEFAULT 'safe' NOT NULL,
	"images" jsonb NOT NULL,
	"panorama_url" text,
	"model_3d_url" text,
	"verified_source" text DEFAULT 'ASI' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "heritage_sites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"hub_city" text NOT NULL,
	"travel_mode" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"distance_km" integer NOT NULL,
	"stop_site_ids" jsonb NOT NULL,
	CONSTRAINT "trails_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text DEFAULT 'visitor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "citizen_archives" ADD CONSTRAINT "citizen_archives_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;