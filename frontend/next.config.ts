import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For dummy images
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Increased for certificate generation with large images
    },
  },
};

export default nextConfig;
