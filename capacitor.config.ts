import type { CapacitorConfig } from "@capacitor/cli";

// Orvio native shell. It loads the live deployed site (so web updates ship
// instantly without an app-store resubmit) and adds the native bits that make it
// a real app — push notifications and camera. See orvio-ai/proxy/MOBILE.md.
//
// NOTE: this file is read only by the Capacitor CLI, not the Vite build, so the
// @capacitor/cli import does not affect the web app and is fine before install.
const config: CapacitorConfig = {
  appId: "app.orvio.mobile",
  appName: "Orvio",
  webDir: "dist",
  server: {
    url: "https://orvio-two.vercel.app",
    cleartext: false,
  },
  ios: { contentInset: "always" },
  plugins: {
    PushNotifications: { presentationOptions: ["badge", "sound", "alert"] },
  },
};

export default config;
