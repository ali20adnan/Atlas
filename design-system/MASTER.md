# Atlas — Design System

Enterprise warehouse operations app for bilingual (Arabic / English) Android and iOS.

## Product
- **Type:** Enterprise operations / inventory tool
- **Users:** Storekeepers, warehouse operators, supervisors
- **Primary jobs:** Scan a barcode → full item status; search existing items
- **Emotion:** Trust, calm competence, speed
- **Peak moment:** Successful scan revealing a complete, confident status card
- **End moment:** Clear location + quantity + next action

## Style
Minimalism & Swiss Style. Industrial slate + stock green. No decoration for its own sake.

## Color tokens

| Role | Light | Dark |
|------|-------|------|
| Background | `#F8FAFC` | `#0B1220` |
| Surface | `#FFFFFF` | `#111827` |
| Surface muted | `#F1F5F9` | `#1E293B` |
| Foreground | `#0F172A` | `#F8FAFC` |
| Secondary text | `#475569` | `#CBD5E1` |
| Muted text | `#64748B` | `#94A3B8` |
| Border | `#E2E8F0` | `#243044` |
| Accent / CTA | `#059669` | `#34D399` |
| Accent soft | `#ECFDF5` | `#064E3B` |
| Warning | `#D97706` | `#FBBF24` |
| Danger | `#DC2626` | `#F87171` |

Primary CTA is emerald (10%). Surfaces are slate neutrals (60/30).

## Typography
- Latin: Noto Sans 400 / 600
- Arabic: Noto Sans Arabic 400 / 600
- Sizes: 13 label, 15 body, 18 title, 28 display
- Line height body: 1.5

## Spacing
8-point grid: 4, 8, 12, 16, 24, 32, 48.

## Motion
150–300ms ease-out. Respect reduced motion. Press scale 0.98. No layout-shifting transforms.

## Navigation
Three tabs only: Find, Scan, Account. Scan is the default. No dashboard. Item detail is a push.

## Density
One job per screen. No demo chrome, no duplicate CTAs, no progress bars, no card stacks. List rows over cards. Hairline borders. Regular + semibold only.

## RTL
Arabic uses RTL layout via style direction (row-reverse, textAlign, writingDirection). Language switch is instant.

## Updates
Floating bottom card (not a blocking modal) when an OTA or store update is available. Later / Install. Wired to `expo-updates` for future EAS Update.
