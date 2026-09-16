import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tower3hdoil.app',
  appName: 'Tower 3 HD Oil',
  webDir: 'dist',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile'
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'ionic'
  }
};

export default config;
