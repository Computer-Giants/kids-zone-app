# 0006. Brand Assets and SEO Metadata Architecture

**Date**: 2026-10-15
**Status**: Accepted

## Summary

This specification establishes search engine optimization, Open Graph social share cards, browser favicons, and Web App Manifest rules for the Kid Zone web application. It connects the newly added brand assets to Next.js 15 metadata APIs while strictly protecting family privacy by excluding protected parent and child routes from search engines. Following this plan gives the public marketing surface discoverability, provides social preview cards when links are shared, and prevents family account screens from ever being indexed.

## Context

The Kid Zone brand asset pack was placed in the public images directory with vector masters, raster logos, app icons, social cards, and favicons. The current web application shell in the repository contains minimal metadata with placeholder icons and lacks Open Graph tags, canonical domain resolution, and crawler instructions.

Without proper search metadata, search engines and social platforms cannot display rich previews or verified ownership when parents discover the application. More critically, family accounts, parent dashboards, and child profile screens could become crawlable if boundary policies are not configured explicitly.

We need a clean setup using standard Next.js 15 App Router conventions that serves the public marketing surface while locking down family privacy.

## Requirements

**User stories**:

- As a parent searching for Catholic learning for my children, I want to find Kid Zone on search engines with descriptive snippets and accurate branding so that I trust the platform.
- As a parish leader or parent sharing Kid Zone on social media or messaging apps, I want shared links to display rich previews with the lamb guide and brand card so that recipients see what the platform offers.
- As a privacy conscious parent, I want all household management, child profiles, and learning dashboards shielded from search engines so that family data remains completely private.

**Acceptance criteria**:

- **AC-1**: Base metadata specifies canonical URL resolution using the production domain https://kidzone.app with fallbacks to environment variables or localhost for local work.
- **AC-2**: Standard browser favicons and Apple touch icons resolve without error at both the website root and through explicit metadata links.
- **AC-3**: Public pages render complete Open Graph and Twitter Card tags pointing to the 1200 by 630 brand preview asset with descriptive titles.
- **AC-4**: A programmatic robots configuration permits indexing for public marketing routes while disallowing parent dashboards, profile pickers, API routes, and child areas.
- **AC-5**: A programmatic sitemap configuration publishes canonical URLs for indexable public pages including the home page, login, and registration.
- **AC-6**: A Web App Manifest supplies application branding, theme colors, cream background color, and icons for mobile home screen installation.

## Options considered

### Option 1: Next.js programmatic metadata with mirrored root icons and privacy boundary (Recommended)

Use TypeScript metadata generators (layout metadata, robots.ts, sitemap.ts, manifest.ts) combined with mirroring root icon files (favicon.ico, favicon.svg, apple-touch-icon.png) to public root.

**Pros**:

- Automatic compile time validation for sitemap and robots routes.
- Legacy browsers and crawlers requesting /favicon.ico or /apple-touch-icon.png directly get fast responses without redirects or 404 errors.
- Strict isolation of private family areas using both robots.txt rules and noindex headers.

**Cons**:

- Small duplication of three icon files between the images directory and public root.

### Option 2: Metadata links only with assets exclusively in public images

Keep all brand assets exclusively inside public/images/ and declare paths via link tags without copying files to public root.

**Pros**:

- Single location for all asset files.

**Cons**:

- Many web crawlers, RSS aggregators, and browser bookmark managers query /favicon.ico and /apple-touch-icon.png directly at the domain root, causing 404 log noise and missing bookmark icons.

### Option 3: Static text files for robots and sitemap

Create static robots.txt and sitemap.xml files manually in the public folder instead of Next.js route generators.

**Pros**:

- Simple static file serving.

**Cons**:

- Lacks dynamic base URL binding across preview and production environments.
- High drift risk when new public pages or protected routes are added.

## Decision

**Chosen option**: Option 1: Next.js programmatic metadata with mirrored root icons and privacy boundary

Implement Next.js 15 metadata in the root layout, generate robots.ts, sitemap.ts, and manifest.ts in TypeScript, mirror root browser icons to public root, and disallow protected family routes.

## Rationale

Option 1 provides crawler compatibility and type safety. Older mobile browsers and link unfurling bots ping /favicon.ico and /apple-touch-icon.png at the server root regardless of HTML head declarations; mirroring these three core files prevents broken requests. Utilizing Next.js programmatic generators (robots.ts, sitemap.ts, manifest.ts) guarantees that the canonical base domain automatically tracks production or preview deployment URLs. Most importantly, explicit robot disallow directives protect our Catholic safeguarding commitment to family data privacy.

## Feature design

**Brand asset mapping**:

| Asset purpose       | Source file in public/images/ | Public path                                            |
| ------------------- | ----------------------------- | ------------------------------------------------------ |
| Root icon legacy    | favicon.ico                   | /favicon.ico and /images/favicon.ico                   |
| Root icon vector    | favicon.svg                   | /favicon.svg and /images/favicon.svg                   |
| iOS touch icon      | apple-touch-icon.png          | /apple-touch-icon.png and /images/apple-touch-icon.png |
| PWA standard icon   | icon-192.png                  | /images/icon-192.png                                   |
| PWA large icon      | icon-512.png                  | /images/icon-512.png                                   |
| Social card website | og-website.png                | /images/og-website.png                                 |
| Social card app     | og-app.png                    | /images/og-app.png                                     |
| Brand logo vector   | logo-horizontal.svg           | /images/logo-horizontal.svg                            |

**Search engine indexing policy**:

| Route path        | Purpose                   | Robots directive            | Included in sitemap |
| ----------------- | ------------------------- | --------------------------- | ------------------- |
| /                 | Public landing page       | index, follow               | Yes                 |
| /login            | Parent sign in            | index, follow               | Yes                 |
| /signup           | Parent registration       | index, follow               | Yes                 |
| /parent/*         | Household management      | noindex, nofollow, disallow | No                  |
| /select-profile   | Child avatar selection    | noindex, nofollow, disallow | No                  |
| /api/*            | API RPC endpoints         | disallow                    | No                  |
| /learn/* (future) | Child learning experience | noindex, nofollow, disallow | No                  |

**Value sourcing**:

| Action or surface          | Value produced or displayed      | Source                                                          |
| -------------------------- | -------------------------------- | --------------------------------------------------------------- |
| Root layout canonical base | metadataBase URL                 | process.env.NEXT_PUBLIC_APP_URL or fallback https://kidzone.app |
| Social share card          | og:image and twitter:image       | /images/og-website.png with 1200x630 dimensions                 |
| Mobile home screen theme   | theme_color and background_color | #FF7A1A orange and #FFF1D6 cream from design.json               |
| Robots rules               | Disallow list                    | Application privacy policy (.agents/AGENTS.md)                  |
| Sitemap entries            | Public URL list                  | Next.js sitemap generator reading public routes                 |

**Key invariants**:

- No child facing route or parent account screen may appear in sitemap.xml or permit search engine indexing.
- Public metadata title template must append the Kid Zone Catholic learning branding.
- All Open Graph images must use absolute URLs generated through metadataBase.

**Security and privacy model**:

- Public marketing pages provide canonical discovery without collecting visitor tracking data.
- Search indexing of family and child screens is forbidden by policy and enforced by robots.txt and route metadata.

**Configuration required**:

- `NEXT_PUBLIC_APP_URL`: Optional deployment domain (defaults to https://kidzone.app in production or http://localhost:3000 in development).

**Critical test scenarios**:

- Happy path: Loading the home page renders title, description, canonical link, Open Graph tags, Twitter card, and manifest link, verifies **AC-1**, **AC-3**, **AC-6**.
- Icon resolution: Fetching /favicon.ico and /apple-touch-icon.png returns valid image content with 200 status, verifies **AC-2**.
- Privacy boundary: Inspecting /robots.txt shows disallow rules for /parent/, /select-profile/, and /api/, and /sitemap.xml contains only public routes, verifies **AC-4**, **AC-5**.

## Build plan

1. Copy root browser icons (favicon.ico, favicon.svg, apple-touch-icon.png) from public/images/ to public/ root, satisfies **AC-2**.
2. Update apps/web/src/app/layout.tsx with complete Metadata configuration including metadataBase, icons, openGraph, twitter, and alternates, satisfies **AC-1**, **AC-2**, **AC-3**.
3. Create apps/web/src/app/manifest.ts defining Web App Manifest metadata, theme colors, and PWA icons, satisfies **AC-6**.
4. Create apps/web/src/app/robots.ts implementing crawl rules and privacy boundaries, satisfies **AC-4**.
5. Create apps/web/src/app/sitemap.ts declaring canonical entries for indexable public pages, satisfies **AC-5**.
6. Add noindex robots metadata to protected parent and profile route layouts, satisfies **AC-4**.
7. Add Schema.org JSON-LD structured data script for EducationalOrganization in the root layout, satisfies **AC-1**, **AC-3**.

## Consequences

**Positive**:

- High quality search engine discovery for prospective parents and parishes.
- Engaging social share cards displaying the friendly lamb guide when links are shared.
- Native home screen installation support on iOS and Android devices.
- Family and child privacy protected against crawler exposure.

**Negative / tradeoffs**:

- Minor asset duplication of three icon files in the public directory.
- Requires updating sitemap.ts whenever new public marketing routes are added.

**Neutral**:

- Production domain environment variable NEXT_PUBLIC_APP_URL should be added to deployment environments.

## Follow-up

- [ ] Set NEXT_PUBLIC_APP_URL in hosting deployment environment variables.
