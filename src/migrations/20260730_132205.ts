import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."guestbook_entry" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"pinned" boolean DEFAULT false NOT NULL,
  	"is_admin" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "guestbook_entry_id" integer;
  CREATE INDEX "guestbook_entry_updated_at_idx" ON "payload"."guestbook_entry" USING btree ("updated_at");
  CREATE INDEX "guestbook_entry_created_at_idx" ON "payload"."guestbook_entry" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guestbook_entry_fk" FOREIGN KEY ("guestbook_entry_id") REFERENCES "payload"."guestbook_entry"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_guestbook_entry_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("guestbook_entry_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."guestbook_entry" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."guestbook_entry" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guestbook_entry_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_guestbook_entry_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "guestbook_entry_id";`)
}
