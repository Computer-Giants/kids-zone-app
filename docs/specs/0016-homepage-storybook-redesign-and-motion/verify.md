# 0016. Homepage Storybook Redesign and Motion Architecture: Verification

This document defines the manual and automated verification procedure for the homepage storybook redesign and motion architecture.

## Automated Verification Steps

1. **Type Check**:

   ```bash
   pnpm check-types
   ```

   Must pass with zero TypeScript diagnostics across all packages and apps.

2. **Linting**:

   ```bash
   pnpm lint
   ```

   Must pass with zero ESLint errors.

3. **Unit Tests**:

   ```bash
   pnpm test
   ```

   All test suites in `@kidzone/ui`, `@kidzone/auth`, and `@kidzone/web` must pass cleanly.

4. **Production Build**:
   ```bash
   pnpm build
   ```
   Next.js static generation and compilation must succeed without warnings.

## Manual Browser Verification Protocol

Open the local development server at `http://localhost:3000` on both desktop browser (1280px) and simulated mobile viewport (375px):

1. **Auth Aware Hero Check (AC-1)**:
   - In a guest window: confirm the primary orange button reads "Begin Your Journey" and points to `/signup`.
   - In a signed in session with child "Leo" selected: confirm the button displays "Continue Leo's Journey" and links to the child's learning route.

2. **Guide Lamb Tooltip and Talking Mouth (AC-2)**:
   - Confirm there is no outer bordered card enclosing the vector lamb.
   - Tap the lamb or click mood selector buttons ("happy", "thinking", "celebrating", "encouraging").
   - Confirm the speech bubble floats above the lamb with zero vertical jumping or shifting of the surrounding hero text.
   - Observe the lamb mouth opening and closing while typewriter text is rendering, and returning to a gentle closed smile when typing completes.

3. **Floating QR Code Application Card (AC-3)**:
   - Confirm the download card appears in the bottom right corner of the viewport.
   - Check that the QR code is clearly visible alongside the App Store and Google Play badges.
   - Click the dismiss button: confirm the card smoothly fades out.
   - Refresh the page or navigate away and back: confirm the card does not reappear in that session.

4. **Analytics Quest Hub (AC-4)**:
   - Scroll to the analytics section: confirm the presence of the Streak card with flame icon, Weekly Stars counter, Sacred Reading minutes card, and Spaced Repetition warmup card.
   - Confirm each card displays distinct pastel color tints matching our design system tokens.

5. **Motion Card Expansion (AC-5)**:
   - Click on any learning feature card (e.g. "Children's Bible" or "Inside the Church Tour").
   - Verify that the card scales smoothly outward to expand into the screen as the new route loads.

6. **Layered Sticky Wave Stacking (AC-6)**:
   - Slowly scroll down the homepage.
   - Confirm that each subsequent section features an organic wavy top border and scrolls smoothly over the previous section like stacked storybook pages.

7. **Accessible Buttons and Touch Targets (AC-7, AC-8)**:
   - Confirm all interactive buttons and cards have touch targets of at least forty eight pixels.
   - Confirm primary orange CTA remains prominent with high contrast text.
   - Turn on system `prefers-reduced-motion`: verify that typewriter text appears instantly and card navigation occurs without spring scaling.
