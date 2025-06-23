const nextConfig = {
  reactStrictMode: true,
  // ⛔ TypeScript 오류 방지용 as any 처리
  experimental: {
    serverActions: true,
  } as any,
  transpilePackages: ['@clerk/nextjs'],
};

export default nextConfig;