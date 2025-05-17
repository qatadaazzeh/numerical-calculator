import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel, we don't need special configuration
  // The GitHub Pages specific settings are commented out
  // output: 'export',
  // basePath: process.env.NODE_ENV === 'production' ? '/numerical-calculator' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/numerical-calculator/' : '',
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
