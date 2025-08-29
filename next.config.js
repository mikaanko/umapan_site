/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true }, // ← ビルドで型エラー無視
  eslint: { ignoreDuringBuilds: true },   // ← ESLintチェックをビルドで無視
};
module.exports = nextConfig;
