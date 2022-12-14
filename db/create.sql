CREATE SCHEMA "users";

CREATE SCHEMA "events";

CREATE SCHEMA "departments";

CREATE TABLE "users"."user" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "role_id" int NOT NULL,
  "full_name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password_hash" varchar(128) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (current_timestamp)
);

CREATE TABLE "users"."role" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" text UNIQUE NOT NULL
);

CREATE TABLE "events"."event" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "creator_user_id" int NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "image_url" text,
  "department_id" int,
  "starts_at" timestamp NOT NULL,
  "ends_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (current_timestamp)
);

CREATE TABLE "events"."tag" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" text UNIQUE NOT NULL,
  "color" text NOT NULL
);

CREATE TABLE "events"."event_tag" (
  "event_id" int,
  "tag_id" int,
  PRIMARY KEY ("event_id", "tag_id")
);

CREATE TABLE "departments"."faculty" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" text UNIQUE NOT NULL,
  "address" text,
  "phone" text,
  "email" text,
  "image_url" text,
  "url" text
);

CREATE TABLE "departments"."department" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "faculty_id" int NOT NULL,
  "name" text UNIQUE NOT NULL,
  "phone" text,
  "email" text,
  "image_url" text,
  "url" text
);

COMMENT ON COLUMN "events"."event"."starts_at" IS 'What date and time the event starts at';

COMMENT ON COLUMN "events"."event"."ends_at" IS 'When the event ends. Must be greater than `starts_at`';

ALTER TABLE "users"."user" ADD FOREIGN KEY ("role_id") REFERENCES "users"."role" ("id");

ALTER TABLE "events"."event" ADD FOREIGN KEY ("creator_user_id") REFERENCES "users"."user" ("id");

ALTER TABLE "events"."event" ADD FOREIGN KEY ("department_id") REFERENCES "departments"."department" ("id");

ALTER TABLE "events"."event_tag" ADD FOREIGN KEY ("event_id") REFERENCES "events"."event" ("id");

ALTER TABLE "events"."event_tag" ADD FOREIGN KEY ("tag_id") REFERENCES "events"."tag" ("id");

ALTER TABLE "departments"."department" ADD FOREIGN KEY ("faculty_id") REFERENCES "departments"."faculty" ("id");
