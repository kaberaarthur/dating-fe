import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",  // Match any request to `/backend/*`
        destination: "http://localhost:5000/:path*", // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
