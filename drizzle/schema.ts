import { serial, boolean, doublePrecision, integer, pgEnum, pgTable, timestamp, text } from "drizzle-orm/pg-core";

export const objectTypeEnum = pgEnum("object_type", ["org", "place"]);
export const controlTypeEnum = pgEnum("control_type", ["checkbox", "radio"]);

export const object = pgTable("object", {
  id: serial("id").primaryKey(),
  type: objectTypeEnum("type"),
  name_full: text("name_full"),
  name_where: text("name_where"),
  name_type: text("name_type"),
  status_inherit: boolean("status_inherit"),
  status: text("status"),
  status_comment: text("status_comment"),
  status_confirm: text("status_confirm"),
  status_instead_id: integer("status_instead_id"),
  city_id: integer("city_id"),
  parent_id: integer("parent_id"),
  address: text("address"),
  address_2: text("address_2"),
  coord_inherit: boolean("coord_inherit"),
  coord_lat: doublePrecision("coord_lat"),
  coord_lon: doublePrecision("coord_lon"),
  description: text("description"),
  schedule_inherit: boolean("schedule_inherit"),
  schedule_247: boolean("schedule_247"),
  schedule_date: timestamp("schedule_date"),
  schedule_source: text("schedule_source"),
  schedule_comment: text("schedule_comment"),
  created: timestamp("created"),
  modified: timestamp("modified"),
})

export const section = pgTable("section", {
  id: serial("id").primaryKey(),
  name: text("name"),
  object_type: objectTypeEnum("object_type"),
})

export const spec = pgTable("spec", {
  id: serial("id").primaryKey(),
  name_service: text("name_service"),
  name_filter: text("name_filter"),
  object_type: objectTypeEnum("object_type"),
  control_type: controlTypeEnum("control_type"),
})

export const option = pgTable("option", {
  id: serial("id").primaryKey(),
  name: text("name"),
  spec_id: integer("spec_id").references(() => spec.id),
})

export const object_link = pgTable("object_link", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  order: integer("order"),
  value: text("value"),
  comment: text("comment"),
})

export const object_phone = pgTable("object_phone", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  order: integer("order"),
  value: text("value"),
  comment: text("comment"),
})

export const object_schedule = pgTable("object_schedule", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  day_num: integer("day_num"),
  time: text("time"),
  from: integer("from"),
  to: integer("to"),
})

export const object_photo = pgTable("object_photo", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  name: text("name"),
  order: integer("order"),
  uploaded: timestamp("uploaded"),
})

export const object_on_section = pgTable("object_on_section", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  section_id: integer("section_id").references(() => section.id),
})

export const object_on_option = pgTable("object_on_option", {
  id: serial("id").primaryKey(),
  object_id: integer("object_id").references(() => object.id),
  option_id: integer("option_id").references(() => option.id),
})

export const section_on_spec = pgTable("section_on_spec", {
  id: serial("id").primaryKey(),
  section_id: integer("section_id").references(() => section.id),
  spec_id: integer("spec_id").references(() => spec.id),
})

export const city = pgTable("city", {
  id: serial("id").primaryKey(),
  name: text("name"),
  name_preposition: text("name_preposition"),
  admin1_name: text("admin1_name"),
  admin2_name: text("admin2_name"),
  coord_lat: doublePrecision("coord_lat"),
  coord_lon: doublePrecision("coord_lon"),
  country_name: text("country_name"),
})