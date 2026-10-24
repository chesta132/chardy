import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  CREATE INDEX "media_locales_parent_id_idx" ON "payload"."media_locales" USING btree ("_parent_id");
  CREATE INDEX "project_sites_locales_parent_id_idx" ON "payload"."project_sites_locales" USING btree ("_parent_id");
  CREATE INDEX "project_locales_parent_id_idx" ON "payload"."project_locales" USING btree ("_parent_id");
  CREATE INDEX "hero_locales_parent_id_idx" ON "payload"."hero_locales" USING btree ("_parent_id");
  CREATE INDEX "about_me_locales_parent_id_idx" ON "payload"."about_me_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "payload"."media_locales_parent_id_idx";
  DROP INDEX "payload"."project_sites_locales_parent_id_idx";
  DROP INDEX "payload"."project_locales_parent_id_idx";
  DROP INDEX "payload"."hero_locales_parent_id_idx";
  DROP INDEX "payload"."about_me_locales_parent_id_idx";
  ALTER TABLE "payload"."users" DROP COLUMN "reset_password_requested_at";`)
}
