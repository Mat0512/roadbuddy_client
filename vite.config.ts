import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the mode (e.g., 'development', 'production')
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx,jsx}"',
        },
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    preview: {
      port: 5000,
    },
    base: '/',
    define: {
      'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(
        env.REACT_APP_GOOGLE_MAPS_API_KEY,
      ),
      // Add other environment variables if needed
    },
  };
});
