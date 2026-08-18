# Build Prompt: `SpiderWebRibbons` Component

## Context
Modify the existing React Bits `Ribbons` component (React + `ogl` WebGL library) into a Spider-Man-themed cursor-trailing "web silk" effect. Keep the underlying mouse-follow physics engine identical — only change the **visual style** of the rendered strands and add **dark/light mode awareness**.

---

## 1. Base to start from
Use the existing `Ribbons.jsx` + `Ribbons.css` (React Bits, JS + CSS variant, dependency: `ogl`) as the starting point. Do not rewrite the physics — reuse:
- The `Renderer`, `Transform`, `Polyline` setup from `ogl`
- The per-strand spring/friction/mouseVelocity trailing logic
- The `points` interpolation loop (`lerp` based on `maxAge` / `speedMultiplier`)
- The resize + mousemove/touch event handling
- The cleanup on unmount

---

## 2. What changes

### A. Visual style of each strand ("comic web silk" look)
- Replace the smooth gradient-fade ribbon shader with a **flat-colored, thicker strand** that has a **thin dark inked outline**, similar to comic-book line art.
- Remove the sine-wave shimmer (`enableShaderEffect` / `uEffectAmplitude`) — webbing shouldn't ripple like silk fabric.
- Remove the fade-along-length effect (`enableFade`) — comic web strands are solid, not gradiented.
- Increase default thickness compared to the original (`baseThickness`) so strands read clearly as "webbing" rather than thin ribbon.
- Fragment shader should output:
 - A solid fill color (see color logic below)
 - A slightly darker/black edge stroke near the UV boundary (`vUV.y` near 0 or 1, or use a screen-space edge detection via derivative/fwidth) to mimic comic ink outlines.

### B. Strand count
- Default to **3 strands** trailing from the cursor (instead of whatever arbitrary count).
- Still driven by the `colors` array length — just default that array to 3 entries.

### C. Color logic — auto dark/light mode
- No `theme` prop. Detect automatically using `window.matchMedia('(prefers-color-scheme: dark)')`.
- Also **listen for changes** (user can toggle system theme mid-session) via the `change` event on the media query list, and update strand color live.
- Color mapping:
 - **Dark mode** → white/silver strands (e.g. `#F5F5F5`) with a black outline
 - **Light mode** → black/dark-grey strands (e.g. `#1A1A1A`) with a slightly darker outline (or no outline, just the fill, since it's already dark)
- This overrides/ignores any `colors` prop passed in — the component should self-manage color based on system theme, defaulting all active strands to the same theme-derived color (not multi-colored).

### D. Everything else stays the same
- Same prop interface as the original component (`baseSpring`, `baseFriction`, `baseThickness`, `offsetFactor`, `maxAge`, `pointCount`, `speedMultiplier`, `backgroundColor`) so it's a drop-in replacement.
- `enableFade` and `enableShaderEffect` props can remain in the signature for backward compatibility but should be ignored/hardcoded off internally (or removed entirely — your call, but note it in code comments if removed).
- Same cleanup/resize/event-listener behavior.

---

## 3. New/changed prop defaults

| Prop | Old default | New default | Reason |
|---|---|---|---|
| `colors` | `['#5227FF']` | `['auto', 'auto', 'auto']` (or just internally default to 3 strands) | 3 strands, theme-driven color |
| `baseThickness` | 30 | 40–45 | Thicker, more comic-style |
| `enableFade` | true | false (ignored) | Solid web strands, no fade |
| `enableShaderEffect` | true | false (ignored) | No shimmer/wave on webbing |

---

## 4. Shader-level requirements (for whoever implements)
- **Vertex shader**: keep as-is (handles thickness/normal offset for the ribbon strip geometry). No changes needed here since geometry logic is unaffected.
- **Fragment shader**: 
 - Add a `uColor` uniform driven by detected theme (already exists, just repurpose)
 - Add an `uOutlineColor` uniform (black, or theme-appropriate dark tone)
 - Use `vUV.x` (across the strand width) to determine proximity to the strand edge — apply outline color when `vUV.x < 0.08 || vUV.x > 0.92` (tweak threshold to taste), fill color otherwise
 - Remove/ignore `uEnableFade` and `uEnableShaderEffect` uniforms in the render path

---

## 5. New JS logic to add
```
useEffect for theme detection:
- const mq = window.matchMedia('(prefers-color-scheme: dark)')
- set initial isDark state
- mq.addEventListener('change', handler) → update isDark → update uColor uniform on all active polylines
- cleanup: mq.removeEventListener on unmount
```
This should live alongside the existing WebGL setup `useEffect`, and update the `uColor` uniform value directly on each line's polyline program when theme changes (no need to recreate the whole scene).

---

## 6. Deliverable naming
- Component: `SpiderWebRibbons.jsx` (renamed from `Ribbons.jsx` to reflect theme, or keep as `Ribbons.jsx` if you want true drop-in replacement — your call)
- Stylesheet: `SpiderWebRibbons.css` (same container styling as original, no changes needed there)

---

## 7. Usage example (what the final component should support)
```jsx
import SpiderWebRibbons from './SpiderWebRibbons';

<div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
  <SpiderWebRibbons
    baseThickness={40}
    speedMultiplier={0.5}
    maxAge={500}
  />
</div>
```
No `colors`, `enableFade`, or `enableShaderEffect` needed — component self-manages theme and strand look.

---

## 8. Acceptance checklist
- [ ] 3 strands trail the cursor with original spring/friction physics intact
- [ ] Strands render as flat-colored comic-style shapes with visible dark outline
- [ ] No shimmer/wave animation on the strands
- [ ] No fade-to-transparent along strand length
- [ ] Strand color is white/silver in dark mode, black/dark-grey in light mode
- [ ] Color updates live if system theme is toggled without page reload
- [ ] Thickness reads as noticeably chunkier than original ribbon default
- [ ] Component drops into existing layout with same container sizing behavior as original
