import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'sharp': '',
      'onnxruntime-node': '',
    },
  },
};

export default nextConfig;
