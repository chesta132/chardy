import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { cloudinaryStorage } from "payload-cloudinary";
import { CLOUDINARY_FOLDER, CLOUDINARY_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET, DATABASE_URL, PAYLOAD_SECRET } from "./config";
import { routing } from "./i18n/routing";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Hero } from "./cms/globals/Hero";
import { AboutMe } from "./cms/globals/AboutMe";
import { ContactMe } from "./cms/globals/ContactMe";

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
  globals: [Hero, AboutMe, ContactMe],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "types/payload.ts"),
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
        cloud_name: CLOUDINARY_CLOUD_NAME || "",
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
