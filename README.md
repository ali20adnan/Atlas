# Atlas

Scan a barcode or QR code to see stock, location, and status. Search the catalog. Arabic and English. Android and iPhone.

## Run

```bash
npm start
```

Then open **Expo Go** on your phone (Android or iOS) and scan the QR code. For a simulator: `npm run android` or `npm run ios` (iOS needs a Mac).

## Demo login

| Role | Username | Password |
|------|----------|----------|
| Supervisor | `admin` | `warehouse` |
| Operator | `operator` | `scan123` |

## Sample barcodes

`6281001234567` · `WH-1001` · `QR-A4-8821` · `IT-LP-5540`

On a device, scan any of these. On web or without a camera, use **Enter code manually**.

## Features

- Login with organization credentials
- Camera scan (default)
- Catalog search
- Item status: quantity, location, movements
- Arabic (RTL) and English
- Light / dark / system appearance
- Floating update card for future OTA releases (`expo-updates`)

## Future store builds

```bash
npx eas-cli init
npx eas build --platform android
npx eas build --platform ios
npx eas update --branch production --message "Warehouse catalog"
```

The in-app floating update banner is already wired to `expo-updates`.
