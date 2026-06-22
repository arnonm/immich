import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE "album_user" ALTER COLUMN "permissions" SET DEFAULT '{asset.read,exif.read,person.read}'`.execute(db);
  await sql`
    UPDATE "album_user"
    SET "permissions" = "permissions" || '{person.read}'::sharing_permission_enum[]
    WHERE "role" != 'owner'
      AND NOT ('all' = ANY ("permissions"))
      AND NOT ('person.read' = ANY ("permissions"))
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE "album_user" ALTER COLUMN "permissions" SET DEFAULT '{asset.read,exif.read}'`.execute(db);
  await sql`
    UPDATE "album_user"
    SET "permissions" = array_remove("permissions", 'person.read'::sharing_permission_enum)
    WHERE 'person.read' = ANY ("permissions")
  `.execute(db);
}
