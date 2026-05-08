import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { cloudinaryStorage } from "payload-cloudinary";
import { CLOUDINARY_FOLDER, CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET, DATABASE_URL, PAYLOAD_SECRET } from "./config";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { routing } from "./i18n/routing";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    cloudinaryStorage({
      config: {
        api_key: CLOUDINARY_KEY || "",
        api_secret: CLOUDINARY_SECRET || "",
        cloud_name: CLOUDINARY_NAME || "",
      },
      collections: {
        media: true,
      },
      folder: CLOUDINARY_FOLDER,
    }),
  ],
  localization: {
    locales: [...routing.locales],
    defaultLocale: routing.defaultLocale,
  },
});
