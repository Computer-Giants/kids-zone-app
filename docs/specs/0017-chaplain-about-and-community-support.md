# Feature Spec: Chaplain About, Community Gallery, and Support Hub

- **Status**: In Progress
- **Type**: Feature
- **Scope**: `apps/web`
- **Owner**: Principal Architect

## Summary

This specification establishes an About Chaplain and Community Support experience for Kid Zone across both a featured homepage section and a dedicated `/about` page. It highlights platform chaplain Fr. Michael Ifeanyi Ezeora and his pastoral mission to form children in Catholic faith and practical life skills through free community classes in computer science, music, athletics, and catechesis. It also provides an interactive photo gallery from community outreaches, a transparent bank support card with one tap account copying, and a social sharing hub with prefilled messages for Catholic families. All external links and financial actions strictly observe the child safeguarding parent gate policy.

## Requirements

1. **Chaplain Profile**: Present Fr. Michael Ifeanyi Ezeora as platform chaplain and pastoral director with his full vestment portrait, pastoral vision, and dedication to faith and skill building.
2. **Community Photo Gallery**: Showcase real community outreach moments including free skill classes at Wisdom Hall and youth sports gatherings, with responsive tap preview and reverence descriptions. No child in any photo is ever named or identified.
3. **Transparent Support Details**: Display direct bank transfer information for benefactors supporting free classes, complete with a one tap copy account button and visual confirmation feedback.
4. **Catholic Social Sharing**: Provide share actions (Web Share API, WhatsApp, direct link copy) with warm, prefilled faith invitations for families.
5. **Dual Surface Integration**: Deliver both an engaging section on the homepage and a comprehensive standalone `/about` page with rich pastoral history and mission details.
6. **Parent Gate Enforcement**: In accordance with platform safeguarding rules, any action leaving the app (sharing to WhatsApp or external apps) or copying financial transfer information when a child session is active must be protected by the multiplication math parent gate (`ParentGateModal`).
7. **Clean Navigation**: Keep child learning tabs in `NAV_SECTIONS` intact. Expose `/about` through the homepage, header utilities, and footer navigation.

## Decision

### 1. Information Architecture and Routing

- **Homepage Section**: Positioned between the Catholic Reviews and Storybook Footer in `apps/web/src/app/home-view.tsx`, providing immediate credibility and human warmth to new visitors.
- **Dedicated Route (`apps/web/src/app/about/page.tsx`)**: Full page experience detailing the story of the ministry, curriculum of free classes (computers, music, sports, catechism), full photo gallery, and donation options.
- **Top Navigation and Footer Links**: Added to the desktop TopNav utility area and the storybook footer under `For Parents` and `Explore Faith`. `NAV_SECTIONS` remains untouched to preserve the five core child tabs.

### 2. Chaplain Bio and Pastoral Statement

- **Chaplain Name**: Rev. Fr. Michael Ifeanyi Ezeora
- **Role**: Platform Chaplain and Pastoral Director
- **Bio Text**:
  "Fr. Michael is a Catholic priest dedicated to raising children who are both strong in Christian virtue and equipped with practical modern skills. Through weekly free classes in computer programming, keyboard and music theory, and youth athletics, he guides young disciples to discover their God given talents with joy and discipline."
- **Portrait Asset**: `apps/web/public/images/about/fr-michael-ifeanyi-ezeora.png` with gold pastoral badge.

### 3. Gallery and Child Privacy Protection

- **Wisdom Hall Free Classes**:
  - Image: `apps/web/public/images/about/wisdom-hall-classes.jpg`
  - Caption: "Parish children gathered for free computer, music, and academic empowerment classes at Wisdom Hall."
  - Safeguard Rule: No individual child is named or tagged.
- **Youth Sports and Teamwork**:
  - Image: `apps/web/public/images/about/sports-youth-outreach.jpg`
  - Caption: "Catholic youth enjoying community football, athletics, and fellowship in a safe Christian environment."
  - Safeguard Rule: No individual child is named or tagged.
- **Visual Presentation**: Responsive storybook cards with subtle hover lift and accessible alt text.

### 4. Support and Financial Transparency Card

- **Default Account Details**:
  - Bank Name: Zenith Bank (or configurable via `NEXT_PUBLIC_SUPPORT_BANK_NAME`)
  - Account Name: Fr. Michael Ifeanyi Ezeora (Kid Zone Youth Ministry)
  - Account Number: `1012345678` (configurable via `NEXT_PUBLIC_SUPPORT_ACCOUNT_NUMBER`)
  - Purpose Tag: Free Computer, Music, and Sports Classes for Parish Children
- **Parent Gate Guard**: When clicked by a child session, opens `ParentGateModal`. Upon passing the challenge, copies the account number to the clipboard.
- **Copy Feedback**: Micro animation toggling from copy icon to green checkmark with "Account Number Copied" confirmation text.
- **Clipboard Fallback**: If `navigator.clipboard` is unavailable or rejected, falls back to a selectable text field.

### 5. Social Sharing Hub

- **Prefilled Message**:
  "Discover Kid Zone! A Catholic learning app for children aged 3 to 15 with Bible stories, saints, and church tours. Grounded in Scripture and 100% priest reviewed."
- **Target URL**: The platform homepage or `/about` page.
- **WhatsApp Direct**: `https://api.whatsapp.com/send?text=${encodeURIComponent(message + " " + url)}`
- **Parent Gate Guard**: When a child session is active, triggering external share opens `ParentGateModal` before launching external application.
- **Error Resilience**: `navigator.share()` catches and silences `AbortError` when users dismiss the system share sheet.

## Build Plan

1. **Assets**: Verify photos in `apps/web/public/images/about/` (`fr-michael-ifeanyi-ezeora.png`, `wisdom-hall-classes.jpg`, `sports-youth-outreach.jpg`).
2. **Components in `apps/web/src/components/`**:
   - `ChaplainMissionSection`: Gallery, bio, support card, and sharing triggers.
   - `SupportAccountCard`: Bank details with copy button and parent gate protection.
   - `SharePlatformCard`: Web Share and WhatsApp invite triggers with parent gate protection.
3. **Homepage Integration**: Embed the section in `apps/web/src/app/home-view.tsx`.
4. **Dedicated Route**: Create `apps/web/src/app/about/page.tsx` with full story, curriculum outline, and photo gallery.
5. **Footer & Nav Updates**: Add `/about` links to footer and TopNav utility row.
6. **Testing and Verification**: Unit test for clipboard copy and parent gate checks; run full test and build.

## Acceptance Criteria

- **AC-1 (Chaplain Spotlight)**: Fr. Michael Ifeanyi Ezeora is featured with full title, vestment portrait, and pastoral vision statement.
- **AC-2 (Outreach Gallery)**: Photos from Wisdom Hall free classes and sports outreach render responsively with reverence descriptions and zero child names.
- **AC-3 (One Tap Copy)**: Tapping copy account number copies the digits to the clipboard and shows visual confirmation.
- **AC-4 (Social Sharing)**: Tapping share launches the Web Share sheet or opens WhatsApp with prefilled encouraging text.
- **AC-5 (Safeguarding Gate)**: In child session mode, sharing externally or copying financial details prompts the `ParentGateModal` before execution.
- **AC-6 (Homepage Integration)**: The chaplain mission section appears on the homepage with smooth wave dividers matching the design system.
- **AC-7 (Dedicated Route)**: Navigating to `/about` displays the standalone story and mission page without errors.
- **AC-8 (Zero Build Regressions)**: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` pass with zero errors.

## Non Goals

- Real time payment gateway processing (e.g. Stripe or Paystack integration is deferred to a future donor phase; direct bank transfer and sharing suffice).
- User comments on photos.
- Third party advertising or tracking scripts.
