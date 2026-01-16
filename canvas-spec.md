# /wall - Signature Wall Canvas

## Overview
Create `/wall` route displaying all guestbook signatures on a pan/zoom canvas. Oldest signatures at center, newest at periphery. Reuse mood board canvas infrastructure.

## Layout Algorithm
- **Seeded random positioning** - Use signature ID as seed for deterministic pseudo-random placement
- **Age bias** - Older signatures clustered near canvas origin (0,0), newer ones placed further out
- **Formula**: `distance = baseRadius + (ageRank * spreadFactor) + seededOffset`
- **Angle**: `seededAngle` based on signature ID for radial distribution

## Data Source
- Fetch from `post` table via `getGuestbookPosts()`
- Each post has: `id`, `created_at`, `signature` (URL), `user` (name, username, image)
- Sort by `created_at` ASC to determine age rank

## Signature Display
- **Uniform bounding box**: All signatures fit within same max dimensions (e.g., 150x100)
- **Stroke color**: Tinted with `grey-700` (light mode) / `grey-300` (dark mode), not pure white
- **No age styling**: Position is only indicator of age

## Interaction
- **Click/tap signature** → Opens dialog with:
  - Author name
  - Sign date (formatted, e.g., "Jan 15, 2025")
  - GitHub link (derived from user data or username)
- **Dialog style**: Match existing guestbook sign dialog aesthetics

## Canvas Behavior
- **Full-page layout**: Uses `position: fixed; inset: 0` to cover viewport (same as mood board)
- **Overlays navbar/footer**: No route group restructuring needed
- **Background**: `bg-grey-50` (light) / `bg-grey-950` (dark) - matches app theme
- **Initial view**: Centered on canvas origin (shows oldest signatures)
- **Controls**: +, -, fit, 100%, fullscreen (same as mood board) - positioned bottom-center
- **Gestures**: Pan, pinch-zoom, wheel zoom (Cmd/Ctrl+scroll)

## Performance
- **Lazy load by viewport**: Only render signatures within visible canvas area + buffer
- **Virtualization**: Track visible elements based on pan/zoom state
- **Image loading**: Use Next.js Image with lazy loading

## Animation
- **Fade from center**: Oldest signatures reveal first, ripple outward
- **Stagger**: ~150ms delay between concentric "rings" of signatures

## Navigation
- **CTA button** at **top-right** of viewport (fixed position): "Sign the Guestbook" → links to `/guestbook`
- No real-time updates; refreshes on revisit

## Sparse State
- Keep normal layout even with few signatures
- No special handling needed

---

## Files to Create/Modify

### New Files
1. `app/wall/page.tsx` - Route page, fetches signatures, renders canvas
2. `app/wall/components/WallCanvas.tsx` - Main canvas component (adapt from mood/Canvas)
3. `app/wall/components/SignatureElement.tsx` - Individual signature render
4. `app/wall/components/SignatureDialog.tsx` - Click dialog with author info
5. `app/wall/components/GuestbookCTA.tsx` - Top-right CTA button
6. `app/wall/hooks/useSignatureLayout.ts` - Seeded random positioning algorithm
7. `app/wall/hooks/useViewportCulling.ts` - Lazy load visible signatures
8. `app/wall/wall.css` - Styles (position:fixed overlay, adapt from mood.css)

### Reuse from mood/
- `useCanvasViewport.ts` - Pan/zoom orchestration
- `useCanvasPanState.ts` - Pan state management
- `useCanvasScaleControls.ts` - Zoom controls
- `useCanvasGestures.ts` - Pointer/wheel handling
- `CanvasControls.tsx` - Control buttons UI

### Modify
- Extract shared canvas hooks to `lib/canvas/` or duplicate in wall/

---

## Implementation Steps

1. Create `/wall` route with basic page structure
2. Port canvas hooks from mood/ to wall/ (or extract shared)
3. Implement `useSignatureLayout` - seeded random positioning with age bias
4. Build `WallCanvas` component with pan/zoom
5. Add viewport culling for lazy rendering
6. Implement `SignatureElement` with grey-tinted rendering
7. Add `SignatureDialog` for click interaction
8. Add CTA button to guestbook
9. Implement fade-from-center reveal animation
10. Style with app theme colors

## Verification
1. Navigate to `/wall` - canvas loads with signatures
2. Pan/zoom works smoothly
3. Oldest signatures near center, newest at edges
4. Click signature → dialog shows name, date, GitHub link
5. Lazy loading works (check devtools network tab while panning)
6. Light/dark mode transitions correctly
7. CTA button navigates to `/guestbook`
8. Mobile: pinch-zoom and pan gestures work
