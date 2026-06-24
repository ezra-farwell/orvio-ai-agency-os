# Orvio mobile — runbook

One app, role-based login (agencies see the dashboard, contractors see the portal).
Path: **PWA now → Capacitor to the stores**. The native shell loads the live site, so
web changes deploy instantly without resubmitting to the stores.

---

## 0. Deploy what's already built (do this first)

```bash
# Apply the new migration (invoices, approvals, and mobile/lead-intake)
supabase db push

# Deploy the new + changed Edge Functions
supabase functions deploy lead-intake send-push stripe-billing

# Secrets the new functions need
supabase secrets set ORVIO_LEAD_INTAKE=ok        # (no secret required for lead-intake; the per-client token is the credential)
```

After this: `/api/ai-health` stays green, and the PWA bits below go live on the next Vercel deploy (already pushed).

---

## 1. PWA — installable this week (free, no accounts)

Already wired: `public/manifest.webmanifest`, `public/sw.js`, the `<link rel="manifest">`
and theme-color in `src/routes/__root.tsx`, and SW registration.

**Test it:** open `https://orvio-two.vercel.app` on your phone → browser menu → **Add to
Home Screen**. It launches full-screen with the Orvio icon, no browser chrome.

**One thing to finish — real icons.** `public/icons/icon.svg` is a placeholder. Generate PNGs
(iOS home-screen needs PNG):

```bash
# with ImageMagick, or use https://realfavicongenerator.net and drop the files in public/icons
magick public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
magick public/icons/icon.svg -resize 512x512 public/icons/icon-512.png
magick public/icons/icon.svg -resize 512x512 public/icons/icon-maskable-512.png
```

---

## 2. Capacitor — the downloadable app

```bash
npm install @capacitor/core @capacitor/cli @capacitor/push-notifications @capacitor/camera
npx cap init Orvio app.orvio.mobile --web-dir dist     # config already in capacitor.config.ts
npx cap add ios        # needs a Mac + Xcode
npx cap add android    # needs Android Studio
npx cap sync
npx cap open ios       # build/run from Xcode
npx cap open android   # build/run from Android Studio
```

`capacitor.config.ts` already points the shell at `https://orvio-two.vercel.app`, so the app
*is* the live site plus native plugins. No web rebuild needed when you deploy.

**Apple will reject a pure web wrapper** — push + camera (below) are what make it approvable.

---

## 3. Push notifications (the "buzz on new lead" feature)

### a) Firebase (Android + the FCM backend for both platforms)
1. Create a Firebase project. Add an Android app (`app.orvio.mobile`) → download `google-services.json` → `android/app/`.
2. Add an iOS app (`app.orvio.mobile`) → download `GoogleService-Info.plist` → add in Xcode.
3. Project settings → Service accounts → **Generate new private key** (a JSON file).

### b) Apple (iOS delivery)
1. Apple Developer ($99/yr) → Keys → create an **APNs key (.p8)**.
2. Upload it to Firebase → Cloud Messaging → APNs authentication key.

### c) Supabase secrets (so `send-push` can deliver)
```bash
supabase secrets set FCM_PROJECT_ID=your-firebase-project-id
supabase secrets set FCM_SERVICE_ACCOUNT="$(cat path/to/service-account.json)"
```
`send-push` is already written (FCM HTTP v1) and no-ops cleanly until these are set.

### d) Native wiring (add after `npm install`, e.g. in a `useEffect` after login)
```ts
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { registerDevice } from "@/lib/push";

export async function initPush() {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") return;
  await PushNotifications.register();
  PushNotifications.addListener("registration", (t) =>
    registerDevice(t.value, Capacitor.getPlatform() as "ios" | "android"),
  );
}
```
The `device_tokens` table + `registerDevice()` are already built; this just feeds them the token.

---

## 4. Lead intake (what triggers the push)

`lead-intake` is a public webhook. Each client has a secret `intake_token` (new column).
Point the contractor's lead form / funnel at:

```
POST https://<project>.supabase.co/functions/v1/lead-intake?token=<client.intake_token>
Content-Type: application/json
{ "name": "Sarah M.", "phone": "248...", "email": "...", "job_type": "Water heater", "budget": "$2k", "timeline": "ASAP", "source": "Meta Ads" }
```

It stores the lead under that client and calls `send-push` → the agency (and the contractor's
portal user) get pinged. `first_contacted_at` is stamped automatically the moment the lead
leaves "New" — that's your speed-to-lead metric, ready for reporting/churn.

*(A UI to surface each client's intake URL in Settings is a small follow-up.)*

---

## 5. Store submission
- **Apple:** $99/yr. Archive in Xcode → upload to App Store Connect → TestFlight → submit. In review notes, mention push (lead alerts) + camera (job photos) as the native value.
- **Google:** $25 one-time. Build an AAB in Android Studio → Play Console → internal testing → production.

## Secrets summary (Supabase)
`FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT` (push) · existing: `STRIPE_*`, `META_*`, `GOOGLE_*`, `APP_URL`, `SUPABASE_*`.
