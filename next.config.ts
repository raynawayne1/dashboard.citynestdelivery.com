/* eslint-disable */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack (Next.js 16)
  turbopack: {},

  // Configure remote image domains for Next.js Image component
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "orbitdel.com" },
      {protocol:"https", hostname:"citynestdelivery.com"}
    ],
  },

  // Add SVGR loader so SVGs can be imported as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,       // Match all SVG files
      use: ["@svgr/webpack"], // Use SVGR loader
    });
    return config;
  },

  // Allow build even if TypeScript has errors (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
