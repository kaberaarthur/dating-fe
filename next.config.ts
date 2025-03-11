import type { NextConfig } from "next";

const isLocalhost = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",  
        destination: isLocalhost 
          ? "http://localhost:5000/:path*"  // Use localhost in development
          : "http://164.92.79.133:5000/:path*", // Use IP in production
      },
    ];
  },
};

export default nextConfig;
