import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Static export only in production — in dev, omitting it lets the dev
  // server handle unknown slugs via dynamicParams instead of throwing 500.
  ...(isDev ? {} : { output: "export" }),
  // Keep the dev compiler cache separate from static build output. Sharing
  // `.next` lets a concurrent build replace chunks while `next dev` is
  // serving them, which produces missing-module and client-manifest errors.
  distDir: isDev ? ".next-dev" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true, // static export requires this
  },
};

export default nextConfig;
