/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 배포 시 ESLint 에러 무시
  },
};

module.exports = nextConfig;