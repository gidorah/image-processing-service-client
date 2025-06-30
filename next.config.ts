import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.IMAGE_S3_HOSTNAME || "",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
