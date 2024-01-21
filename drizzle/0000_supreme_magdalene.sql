DO $$ BEGIN
 CREATE TYPE "control_type" AS ENUM('checkbox', 'radio');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "object_type" AS ENUM('org', 'place');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"name_preposition" text,
	"admin1_name" text,
	"admin2_name" text,
	"coord_lat" double precision,
	"coord_lon" double precision,
	"country_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "object_type",
	"name_full" text,
	"name_where" text,
	"name_type" text,
	"status_inherit" boolean,
	"status" text,
	"status_comment" text,
	"status_confirm" text,
	"status_instead_id" integer,
	"city_id" integer,
	"parent_id" integer,
	"address" text,
	"address_2" text,
	"coord_inherit" boolean,
	"coord_lat" double precision,
	"coord_lon" double precision,
	"description" text,
	"schedule_inherit" boolean,
	"schedule_247" boolean,
	"schedule_date" timestamp,
	"schedule_source" text,
	"schedule_comment" text,
	"created" timestamp,
	"modified" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_link" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"order" integer,
	"value" text,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_option" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"option_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"section_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_phone" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"order" integer,
	"value" text,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_photo" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"name" text,
	"order" integer,
	"uploaded" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"day_num" integer,
	"time" text,
	"from" integer,
	"to" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "option" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"spec_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"object_type" "object_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section_on_spec" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer,
	"spec_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spec" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_service" text,
	"name_filter" text,
	"object_type" "object_type",
	"control_type" "control_type"
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_link" ADD CONSTRAINT "object_link_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_phone" ADD CONSTRAINT "object_phone_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "option" ADD CONSTRAINT "option_spec_id_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "spec"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "spec"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
