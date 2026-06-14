import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = "/nghiemhang/instrument-mountain";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isGithubPages ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
