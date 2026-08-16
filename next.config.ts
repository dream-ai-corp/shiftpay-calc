import type { NextConfig } from "next";

const pagesBase = process.env.PAGES_BASE || "";

const nextConfig: NextConfig = {
  output: pagesBase ? "export" : undefined,
  trailingSlash: Boolean(pagesBase),
  basePath: pagesBase || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
