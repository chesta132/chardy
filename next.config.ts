import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options
const sentryConfig: SentryBuildOptions = {
  org: "chesta",
  project: "chardy",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
};

const withNextIntl = createNextIntlPlugin();

const plugins: ((config: NextConfig) => NextConfig)[] = [withNextIntl, withPayload, (config) => withSentryConfig(config, sentryConfig)];

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
