const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ 올바른 형식
  },
  transpilePackages: ['@clerk/nextjs'],
  eslint: {
    ignoreDuringBuilds: true, // ✅ 빌드 오류 무시
  },
};

export default nextConfig;