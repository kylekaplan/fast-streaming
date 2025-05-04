/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Explicitly ignore these directories
  ignore: [
    'node_modules/**',
    'venv/**',
    '.next/**',
    'dist/**',
    'build/**',
    '.git/**'
  ]
}; 