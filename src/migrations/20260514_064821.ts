import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "project_sites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"site_url" varchar NOT NULL
  );
  
  CREATE TABLE "project_sites_locales" (
  	"site_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "project_sites" ADD CONSTRAINT "project_sites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_sites_locales" ADD CONSTRAINT "project_sites_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_sites"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "project_sites_order_idx" ON "project_sites" USING btree ("_order");
  CREATE INDEX "project_sites_parent_id_idx" ON "project_sites" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "project_sites_locales_locale_parent_id_unique" ON "project_sites_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "project" DROP COLUMN "live_site";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "project_sites" CASCADE;
  DROP TABLE "project_sites_locales" CASCADE;
  ALTER TABLE "project" ADD COLUMN "live_site" varchar;`);
}
