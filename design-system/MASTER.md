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
Quiet luxury. Porcelain & ink neutrals, jewel emerald CTAs, champagne-gold kickers and camera chrome. Depth through layered shadows + hairlines, gradients only on brand surfaces and primary CTAs. No decoration for its own sake.

## Color tokens

| Role | Light | Dark |
|------|-------|------|
| Background | `#F5F4EF` | `#0A0F0D` |
| Surface | `#FFFFFF` | `#131A16` |
| Surface muted | `#EDEBE3` | `#1D2621` |
| Foreground | `#101815` | `#F2F6F3` |
| Secondary text | `#3A4A43` | `#C3CFC8` |
| Muted text | `#68786F` | `#8FA198` |
| Border | `#E3E1D8` | `#27322C` |
| Accent / CTA | `#0E6B4A` | `#43DE9B` |
| Accent gradient | `#18A572 → #0C5C3F` | `#4FE6AC → #1E9E6E` |
| Gold (kickers, camera) | `#A5823C` | `#D8BC80` |
| Accent soft | `#E3F2EA` | `#103425` |
| Warning | `#9A6700` | `#F0C24E` |
| Danger | `#B42318` | `#EF9187` |

Primary CTA is an emerald gradient pill with a soft accent shadow. Surfaces are warm neutrals (60/30). Gold is the 5% accent — kickers, viewfinder, avatar ring, active camera tab.

## Typography
- Latin: Noto Sans 400 / 600 / 700
- Arabic: Noto Sans Arabic 400 / 600 / 700
- Sizes: 11 micro (kicker), 13 label, 16 body, 20 title, 40 display
- Line height body: 1.5
- Kickers: uppercase, letter-spacing 1.6 — **Latin only; never letter-space or uppercase Arabic** (it breaks letterform joining)
- Display titles: bold, negative tracking (-0.5) in Latin only

## Depth
- Cards: radius 26, hairline border + soft shadow (`elevation.card`)
- Floating chrome (tab bar, sheets): `elevation.float`
- CTAs: gradient + `elevation.cta` accent-tinted shadow
- Fields: filled muted; on focus lift to surface + 1.5 accent border + glow

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
