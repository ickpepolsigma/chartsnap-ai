# 3D Animation Prompt for Frontend Agent

## Copy-Paste This Message:

```
ADD 3D ANIMATIONS to enhance the landing page visual appeal.

REQUIREMENTS:
- Add 3D candlestick animation that spins as user scrolls
- Use Three.js + React Three Fiber (already compatible with Next.js)
- Keep it performant (no lag on scroll)
- Match Liquid Glass dark theme
- Make it interactive (mouse hover effects)

SPECIFIC ANIMATIONS TO BUILD:

1. **Hero Section - Spinning 3D Candlestick**
   - Large 3D candlestick model in hero background
   - Spins slowly on scroll (parallax effect)
   - Glows with green/red based on candle color
   - Interactive: responds to mouse movement
   - Glassmorphism overlay so it doesn't distract

2. **Features Section - Floating Elements**
   - Small 3D icons floating next to feature cards
   - Subtle rotation on hover
   - Fade in on scroll using Framer Motion

3. **Examples Section - 3D Badges**
   - Buy/Sell/Nothing badges with 3D depth
   - Tilt effect on hover (3D perspective)
   - Glowing edges using CSS 3D transforms

TECH STACK TO USE:
```bash
# Install these dependencies:
npm install three @react-three/fiber @react-three/drei
npm install framer-motion-3d  # For 3D motion
```

IMPLEMENTATION EXAMPLE:

```tsx
// components/3d-candlestick.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useScroll } from 'framer-motion';

function Candlestick3D() {
  const scrollY = useScroll().scrollY;

  return (
    <Canvas>
      <Float speed={2} rotationIntensity={0.5}>
        <mesh rotation={[0, scrollY * 0.001, 0]}>
          {/* Candlestick geometry */}
          <boxGeometry args={[0.5, 3, 0.5]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

// Use in hero:
<Candlestick3D />
```

DESIGN GUIDELINES:
- Keep animations subtle (don't overwhelm users)
- Maintain 60fps performance
- Mobile-friendly (disable on small screens if needed)
- Glassmorphism overlays to blend with existing design
- Green glow for bullish candles, red glow for bearish

FILES TO UPDATE:
1. app/page.tsx - Add 3D elements to sections
2. components/3d-candlestick.tsx - Create new component
3. components/3d-badge.tsx - Create 3D tilt badges

FREE TOOLS:
✓ Three.js (open source, free)
✓ React Three Fiber (free)
✓ Framer Motion (already installed)

NO paid 3D libraries like Spline or paid Three.js assets.

Start with the hero section 3D candlestick. Test performance, then add more.
```

---

## Alternative: CSS 3D (Lighter Weight)

If Three.js is too heavy, use CSS 3D transforms instead:

```
ALTERNATIVE: CSS 3D Animations (lighter, no Three.js needed)

Use CSS 3D transforms for spinning effects:

```css
/* Add to globals.css */
.candlestick-3d {
  transform-style: preserve-3d;
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.tilt-card {
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
  transition: transform 0.3s ease;
}

.tilt-card:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
}
```

This is lighter and uses only CSS (no extra packages).

Choose based on:
- Three.js = More impressive, heavier
- CSS 3D = Simpler, faster, lighter
```

---

## Quick Start Commands

```bash
# Option 1: Full 3D with Three.js
npm install three @react-three/fiber @react-three/drei

# Option 2: CSS 3D only (no new packages)
# Just use existing CSS transforms
```

---

## Performance Tips

- Use `useMemo` for 3D models
- Disable 3D on mobile if laggy
- Use simple geometries (box, cylinder) not complex models
- Limit number of 3D elements on screen
- Test with Chrome DevTools Performance tab
