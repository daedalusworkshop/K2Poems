# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K2Poems is a poetry portfolio website showcasing Kasra Mikaili's literary works. The application features an elegant, minimalist design with a split-screen layout (desktop) and fixed-image overlay design (mobile), where poems are displayed with smooth transitions between different visual moods.

## Development Commands

### Running the Application

```bash
# Start client development server (Vite) - runs on port 5000 or next available
npm run dev:client

# Start full-stack development (Express + Vite)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push
```

### Node Version Compatibility

The project requires Node.js 18.18+ due to dependencies. If Vite fails to start with Node 18.15.0 or earlier, the dependencies have been configured to use Vite 5.4.0 and @vitejs/plugin-react 4.3.0 for compatibility.

## Architecture

### Monorepo Structure

This is a full-stack TypeScript monorepo with:
- **`client/`**: React + Vite frontend
- **`server/`**: Express.js backend (currently minimal, primarily serves the client)
- **`shared/`**: Shared TypeScript types between client and server
- **`attached_assets/`**: Static image assets for poems

### Path Aliases

The project uses TypeScript path aliases configured in both `tsconfig.json` and `vite.config.ts`:
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

Always use these aliases for imports instead of relative paths.

### Frontend Architecture

**Framework Stack:**
- React 19 with TypeScript
- Wouter for routing (lightweight alternative to React Router)
- TanStack Query for data fetching
- Framer Motion for animations
- Radix UI + custom components for UI primitives
- Tailwind CSS 4 for styling

**Key Design Patterns:**

1. **Split Layout System** (`client/src/pages/home.tsx`):
   - Desktop: Fixed left sidebar (50vw) with scrollable right content (50vw)
   - Mobile: Fixed background image at top (50vh) with scrollable content overlay
   - Image transitions based on active poem using IntersectionObserver

2. **Poem Data Management** (`client/src/lib/poems.ts`):
   - Centralized poem data with interface: `{ id, title, date, content, image? }`
   - Images mapped to poems in `home.tsx` using `poemImages` record
   - Images located in `attached_assets/generated_images/`

3. **Active Poem Detection**:
   - Uses IntersectionObserver with `rootMargin: "-20% 0px -20% 0px"`
   - Triggers when 40%+ of poem is visible in viewport's middle zone
   - Updates `activePoemId` state to drive image transitions

4. **Responsive Spacing**:
   - Desktop: `gap-[60vh]` between poems (allows comfortable scrolling)
   - Mobile: `gap-[100vh]` between poems (ensures full focus on one poem at a time)
   - Mobile spacer: `h-[45vh]` at top to reveal fixed image before content

### Styling Philosophy

The design uses a warm, literary aesthetic:
- **Colors**: Warm cream background (`hsl(43 33% 96%)`), charcoal text, warm brown accents
- **Typography**: Three font families via Google Fonts:
  - Crimson Text (body/serif)
  - Playfair Display (headings/display)
  - Source Sans 3 (sans-serif for metadata)
- **Sharp corners**: All radius values set to `0rem` for elegant, classical feel
- **Minimal borders**: Subtle `border-border/40` for soft divisions

### Component Organization

- `client/src/components/`: Shared components (Navigation, AnimationSettings)
- `client/src/components/ui/`: Radix UI-based primitive components (accordion, button, dialog, etc.)
- `client/src/pages/`: Route pages (home.tsx, not-found.tsx)
- `client/src/lib/`: Utilities (poems data, query client, utils)
- `client/src/hooks/`: Custom hooks (use-mobile, etc.)

### Animation Settings System

The site includes a comprehensive, hidden-by-default settings panel for fine-tuning all visual and animation parameters.

**Accessing the Settings:**
- Press `/` (forward slash) anywhere on the page to toggle the settings panel
- Panel is hidden by default to maintain clean UX
- Settings are live-preview - changes apply immediately

**Settings Architecture (`client/src/components/AnimationSettings.tsx`):**

The `AnimationConfig` interface defines 21+ configurable parameters organized into 4 sections:

1. **Animation Controls:**
   - Image transitions (enable/disable, duration, easing, blend mode)
   - Image scale effects (Ken Burns style zoom)
   - Poem fade effects (opacity, blur, scale for inactive poems)
   - Fine-grained control over transition timing (300ms-1500ms)

2. **Typography:**
   - Line spacing (snug/normal/relaxed/loose)
   - Title font weight (300-700)
   - Body font size (16px-28px)
   - Letter spacing (-0.02em to 0.1em)
   - Date uppercase toggle

3. **Visual Elements:**
   - Image opacity (30%-100%)
   - Image blur/softness (0-20px)
   - Title divider toggle with opacity control
   - Border visibility and opacity

4. **Interaction:**
   - Smooth scrolling behavior

**Saving Settings:**

The panel includes a "Save Settings" feature that generates production-ready TypeScript code:

1. Click "Copy Settings Code" to copy the current configuration
2. The generated code is a complete `AnimationConfig` object
3. Paste into `client/src/pages/home.tsx` to make settings permanent
4. Use "View Code" button to preview before copying

**Default Settings Location:**

Default animation settings are defined in `client/src/pages/home.tsx`:
```typescript
const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
  // 21 parameters with opinionated defaults
  // Located around line 33
});
```

**Implementation Details:**

- All settings use controlled components (sliders, switches, selects)
- Settings panel is scrollable (max-height: 80vh)
- Panel width: 380px for comfortable interaction
- Nested controls indent with accent border for visual hierarchy
- All numeric values display exact current setting
- Tooltips explain each setting's purpose and location on page

**Applying Settings to UI:**

Settings are applied via:
- Inline styles for dynamic values (opacity, blur, font-size, etc.)
- Framer Motion props for animations (duration, easing, scale)
- Conditional rendering for toggleable elements (divider, uppercase)
- CSS custom properties for typography (line-height helper function)

Example application pattern:
```typescript
<motion.img
  transition={{
    duration: animationConfig.imageFadeSpeed,
    ease: animationConfig.imageEasing
  }}
  style={{
    opacity: animationConfig.imageOpacity,
    filter: `blur(${animationConfig.imageBlur}px)`
  }}
/>
```

## Working with Poems

To add or modify poems:

1. Edit `client/src/lib/poems.ts` - add poem to the `poems` array
2. Add corresponding image to `attached_assets/generated_images/`
3. Map the image in `client/src/pages/home.tsx` in the `poemImages` object
4. Images cycle automatically - poem IDs should be numeric strings ("1", "2", "3", etc.)

## Server Architecture

The Express server (`server/index.ts`) is minimal and primarily serves the Vite dev server in development or static files in production. It includes:
- Request logging middleware for API routes
- JSON body parsing with raw body access
- Vite middleware integration in development
- Static file serving in production

The server runs on port 5000 (or `PORT` env variable) and serves both API and client.
