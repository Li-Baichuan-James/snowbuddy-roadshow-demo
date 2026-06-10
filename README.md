# SnowBuddy Roadshow Demo

SnowBuddy Roadshow Demo is a simulated web prototype for showing the core group-skiing flow of the SnowBuddy smart goggle concept.

This prototype is intentionally local and deterministic. It does not use GPS, accounts, backend APIs, real-time sync, microphone recording, Bluetooth, or real hardware connections.

## Demo URL

Production entry:

```text
https://snowbuddy-roadshow-demo.vercel.app/join/DEMO
```

If Vercel assigns a different production URL, update this README, regenerate the QR code, and update any roadshow materials.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

The app is designed around these routes:

```text
/join/DEMO
/app/home
/app/map
/app/goggle
```

## Build And Test

Run tests:

```bash
npm run test
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview -- --host 127.0.0.1
```

## Vercel Deployment

Recommended Vercel settings:

```text
Project name: snowbuddy-roadshow-demo
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Environment Variables: none
Production branch: main
```

The repo includes `vercel.json` with an SPA rewrite so direct visits to `/join/DEMO`, `/app/home`, `/app/map`, and `/app/goggle` resolve to the app.

## Roadshow Assets

QR code target:

```text
https://snowbuddy-roadshow-demo.vercel.app/join/DEMO
```

Generated QR files:

```text
exports/qr/snowbuddy-demo-join-demo.png
exports/qr/snowbuddy-demo-join-demo.svg
```

Local build backup:

```text
exports/demo/local-build/dist/
```

Use the local backup for the host computer if the venue network or Vercel is unavailable.

## Demo Boundaries

- Simulated ski team session per device.
- No app download or account required.
- No GPS, microphone, Bluetooth, database, or map tile permissions.
- Meet, SOS, Voice Check, teammate movement, and goggle HUD are simulated locally.
- Multiple judges can scan and run independent demo sessions at the same time.
