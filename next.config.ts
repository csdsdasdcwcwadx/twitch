import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*' // Proxy to Backend
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        port: '', // 如果有特定端口可以填入，否則保持空字串
        pathname: '/**', // 表示允許這個域名下的所有圖片
      },
      {
        protocol: 'https',
        hostname: 'ec2-54-253-97-210.ap-southeast-2.compute.amazonaws.com',
        pathname: '/twitch/item/images/**',
      },
    ],
  }
};

export default nextConfig;
