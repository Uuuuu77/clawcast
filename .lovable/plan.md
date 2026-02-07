

# ClawCast UI/UX Refinement

## Overview
Six targeted improvements: sidebar disclaimer styling, favicon, dark/light mode toggle, and AI prompt tightening. No structural changes to the chat flow.

---

## 1. Sidebar Disclaimer (compact mode)

**File**: `src/components/chat/ChatSidebar.tsx`

The disclaimer is already positioned at the sidebar bottom. Change it to use the compact variant so it fits the narrow sidebar width without looking oversized.

Change `<DisclaimerFooter />` to `<DisclaimerFooter compact />`.

---

## 2. Desktop Logo - Already Done

The lobster emoji is already visible on all screen sizes in `ClawcastHeader.tsx` (line 35). The "CLAWCAST" text shows on `sm:` and up. No changes needed here.

---

## 3. Custom Favicon (SVG lobster)

**Files**: Create `public/favicon.svg`, modify `index.html`

Create a simple SVG favicon with a lobster emoji rendered as text on a dark circular background (matching the ClawCast brand). Update `index.html` to reference it instead of the default `favicon.ico`. Also update the OG image meta tags to remove the Lovable branding references.

---

## 4. Dark/Light Mode Toggle

**Files**: Create `src/components/ThemeToggle.tsx`, modify `src/App.tsx`, `index.html`, `src/index.css`, `src/components/clawcast/ClawcastHeader.tsx`

- Remove hardcoded `class="dark"` from `<html>` in `index.html` (let next-themes manage it)
- Wrap the app in `<ThemeProvider>` from next-themes in `App.tsx`
- Create a `ThemeToggle` component (Sun/Moon icon button)
- Place it in the header next to the "New" button
- Add proper light mode CSS variables to `index.css` under `:root` (currently both `:root` and `.dark` have identical dark values)

Light mode palette:
- Background: white/light gray
- Foreground: dark text
- Primary: stays cyan
- Cards: white with subtle borders
- Muted: light gray tones

---

## 5. AI Synthesis Prompt Improvements

**File**: `supabase/functions/clawcast-analyze/index.ts`

Tighten the system prompt to emphasize:
- Default to MEDIUM or LOW when evidence is limited (currently defaults to MEDIUM on parse failure, which is fine)
- Add explicit instruction: "If fewer than 3 sources are available, confidence should be LOW"
- Add: "When sources conflict, explicitly state the disagreement in keyDrivers"
- Add: "Never extrapolate beyond what the evidence states"
- Add disclaimer text in changeFactors when confidence is LOW

---

## 6. No Unnecessary Complexity

All changes are surgical edits to existing files. No new pages, no layout restructuring, no new dependencies beyond what's already installed (next-themes is already in package.json).

---

## Technical Details

### Light Mode CSS Variables (added to `:root` in index.css)

```text
:root (light mode defaults):
  --background: 0 0% 100%
  --foreground: 240 10% 10%
  --card: 0 0% 98%
  --card-foreground: 240 10% 10%
  --primary: 180 100% 35% (slightly darker cyan for contrast on white)
  --muted: 240 5% 92%
  --muted-foreground: 240 5% 45%
  --border: 240 5% 85%
  --input: 240 5% 95%
  --message-user-bg: 240 5% 95%
  --message-assistant-bg: 0 0% 98%
```

### ThemeToggle Component

Simple button using `useTheme()` from next-themes. Shows Sun icon in dark mode, Moon icon in light mode. Placed in header right section.

### Files Summary

| File | Action |
|------|--------|
| `src/components/chat/ChatSidebar.tsx` | Add `compact` prop to DisclaimerFooter |
| `public/favicon.svg` | Create SVG favicon |
| `index.html` | Update favicon link, remove hardcoded dark class, update OG meta |
| `src/components/ThemeToggle.tsx` | Create theme toggle component |
| `src/App.tsx` | Wrap in ThemeProvider |
| `src/index.css` | Add light mode variables, move dark values to `.dark` only |
| `src/components/clawcast/ClawcastHeader.tsx` | Add ThemeToggle to header |
| `supabase/functions/clawcast-analyze/index.ts` | Tighten AI synthesis prompt |

