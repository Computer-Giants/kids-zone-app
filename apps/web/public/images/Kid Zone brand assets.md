# Kid Zone brand assets

A small, editable brand pack for the Kid Zone website and app. The source masters are SVG so the lamb mark can later be animated or re-used in the mascot and character system.

## Files

| Asset                                          | Use                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `source/logo-horizontal.svg`                   | Primary wordmark for the website header, nav, docs and wide screens. |
| `source/icon.svg`                              | Master symbol for app icon, favicon and compact UI.                  |
| `website/logo-horizontal.png`                  | 1x and `@2x` raster logo for environments that do not render SVG.    |
| `website/favicon.svg`, `website/favicon.ico`   | Scalable and legacy browser favicons.                                |
| `website/apple-touch-icon.png`                 | 180px iOS home-screen icon.                                          |
| `website/icon-192.png`, `website/icon-512.png` | PWA icons.                                                           |
| `app/icon-512.png`, `app/icon-1024.png`        | Native app icon source sizes.                                        |
| `og/og-website.png`                            | 1200×630 website/social preview.                                     |
| `og/og-app.png`                                | 1200×630 app/install/social preview.                                 |

## Brand decisions

- **Mark:** a friendly lamb guide inside a rounded rainbow badge. The lamb is the product's guide; the rainbow is reserved for the logo and celebratory moments.
- **Ownable colour:** `#FF7A1A` orange, used for the primary action, mascot accent and brand mark.
- **Supporting palette:** warm cream `#FFF1D6`, ink `#2B2D42`, blue `#3D8BFF`, green `#35C76A`, yellow `#FFD23F`, indigo `#5B5BD6`, violet `#A259FF`.
- **Typography:** Fredoka for the wordmark/headings and Nunito for supporting copy, matching `design.json`.
- **Future animation:** keep the lamb as separate semantic parts—body, ears, face, eyes, smile and star—when converting the mark into an animated mascot SVG. Do not animate the wordmark or favicon.

## Recommended metadata

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="alternate icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta property="og:image" content="/og/og-website.png" />
<meta name="twitter:card" content="summary_large_image" />
```

The source SVGs intentionally use text only for the wordmark and social-preview copy; keep those as editable masters. If the final app shell uses a bundled font, render the wordmark with Fredoka for closer alignment.
