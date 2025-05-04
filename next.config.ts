import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  outputFileTracingExcludes: {
    '/api/**': [
      './api/**/*.py',
      './venv/**/*',
      './.git/**/*',
      './node_modules/sentence-transformers/**/*',
      './node_modules/faiss-node/**/*',
      './node_modules/numpy/**/*',
      '**/**.pyc',
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : process.env.BACKEND_URL 
              ? `${process.env.BACKEND_URL}/api/:path*`
              : "https://your-fastapi-deployment-url.com/api/:path*",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "/api/openapi.json",
      },
    ];
  },
};

export default nextConfig;
