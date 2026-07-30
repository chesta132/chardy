import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE SCHEMA IF NOT EXISTS "payload";
  
  ALTER TYPE "public"."_locales" SET SCHEMA "payload";
  ALTER TYPE "public"."enum_featured_project_span" SET SCHEMA "payload";
  ALTER TABLE "public"."users_sessions" SET SCHEMA "payload";
  
  ALTER TABLE "public"."users" SET SCHEMA "payload";
  
  ALTER TABLE "public"."media" SET SCHEMA "payload";
  
  ALTER TABLE "public"."media_locales" SET SCHEMA "payload";
  
  ALTER TABLE "public"."project_tags" SET SCHEMA "payload";
  
  ALTER TABLE "public"."project_sites" SET SCHEMA "payload";
  
  ALTER TABLE "public"."project_sites_locales" SET SCHEMA "payload";
  
  ALTER TABLE "public"."project" SET SCHEMA "payload";
  
  ALTER TABLE "public"."project_locales" SET SCHEMA "payload";
  
  ALTER TABLE "public"."featured_project" SET SCHEMA "payload";
  
  ALTER TABLE "public"."payload_kv" SET SCHEMA "payload";
  
  ALTER TABLE "public"."payload_locked_documents" SET SCHEMA "payload";
  
  ALTER TABLE "public"."payload_locked_documents_rels" SET SCHEMA "payload";
  
  ALTER TABLE "public"."payload_preferences" SET SCHEMA "payload";
  
  ALTER TABLE "public"."payload_preferences_rels" SET SCHEMA "payload";
  
  -- payload_migrations must on payload schema if this migration file running
  -- ALTER TABLE "public"."payload_migrations" SET SCHEMA "payload";
  
  ALTER TABLE "public"."hero" SET SCHEMA "payload";
  
  ALTER TABLE "public"."hero_locales" SET SCHEMA "payload";
  
  ALTER TABLE "public"."about_me_tools" SET SCHEMA "payload";
  
  ALTER TABLE "public"."about_me" SET SCHEMA "payload";
  
  ALTER TABLE "public"."about_me_locales" SET SCHEMA "payload";
  
  ALTER TABLE "public"."contact_me" SET SCHEMA "payload";
  
  ALTER TABLE "public"."ai_config" SET SCHEMA "payload";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "payload"."_locales" SET SCHEMA "public";
  ALTER TYPE "payload"."enum_featured_project_span" SET SCHEMA "public";
  ALTER TABLE "payload"."users_sessions" SET SCHEMA "public";
  
  ALTER TABLE "payload"."users" SET SCHEMA "public";
  
  ALTER TABLE "payload"."media" SET SCHEMA "public";
  
  ALTER TABLE "payload"."media_locales" SET SCHEMA "public";
  
  ALTER TABLE "payload"."project_tags" SET SCHEMA "public";
  
  ALTER TABLE "payload"."project_sites" SET SCHEMA "public";
  
  ALTER TABLE "payload"."project_sites_locales" SET SCHEMA "public";
  
  ALTER TABLE "payload"."project" SET SCHEMA "public";
  
  ALTER TABLE "payload"."project_locales" SET SCHEMA "public";
  
  ALTER TABLE "payload"."featured_project" SET SCHEMA "public";
  
  ALTER TABLE "payload"."payload_kv" SET SCHEMA "public";
  
  ALTER TABLE "payload"."payload_locked_documents" SET SCHEMA "public";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" SET SCHEMA "public";
  
  ALTER TABLE "payload"."payload_preferences" SET SCHEMA "public";
  
  ALTER TABLE "payload"."payload_preferences_rels" SET SCHEMA "public";
  
  -- payload_migrations must on payload schema if this migration file running
  -- ALTER TABLE "payload"."payload_migrations" SET SCHEMA "public";
  
  ALTER TABLE "payload"."hero" SET SCHEMA "public";
  
  ALTER TABLE "payload"."hero_locales" SET SCHEMA "public";
  
  ALTER TABLE "payload"."about_me_tools" SET SCHEMA "public";
  
  ALTER TABLE "payload"."about_me" SET SCHEMA "public";
  
  ALTER TABLE "payload"."about_me_locales" SET SCHEMA "public";
  
  ALTER TABLE "payload"."contact_me" SET SCHEMA "public";
  
  ALTER TABLE "payload"."ai_config" SET SCHEMA "public";
  
  DROP SCHEMA IF EXISTS "payload";
  `);
}
