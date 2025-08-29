/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // ← これで next export 相当
  images: { unoptimized: true } // next/image使ってても安全運転
};
module.exports = nextConfig;
