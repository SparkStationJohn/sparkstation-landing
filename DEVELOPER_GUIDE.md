# ⚡ SparkStation | Developer Reference Guide

## 🏗️ Platform Architecture
SparkStation is a "Zero-Build" dynamic platform designed for artisan hardware management.
- **Frontend:** React SPA (Vite)
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Deployment:** Netlify
- **Core Principle:** Decouple content from code. All marketing, SEO, and product data is fetched in real-time from Supabase.

---

## 👑 Back Office (Platform Admin)
Accessible via `/dashboard` for users with `is_admin: true` in their profile.

### 1. Global Config
- **Banner Control:** Toggle sitewide announcement banner.
- **Banner Logic:** Managed via `site_config` table. Controls text and redirect links.

### 2. SEO Registry
- **Dynamic Meta:** Managed via `site_seo` table.
- **Implementation:** `DynamicSEO.jsx` component hooks into `react-helmet-async` to update meta tags based on the current URL path.

### 3. Hardware Registry
- **Product Lifecycle:** Manage prices and availability (Live, Early Access, Coming Soon).
- **Asset Host:** Images are served from Supabase `marketing-assets` bucket or external URLs.

### 4. Community Moderation
- **Showcase:** Approve/Delete user-submitted missions.
- **Spotlight:** Set the "Featured Artisan" for the homepage.

---

## 🚀 Dynamic Content Engine

### `src/lib/marketing.js`
Utility for fetching core platform content:
- `fetchMarketingFAQ()`: Loads dynamic FAQs.
- `fetchMarketingFeatures(category)`: Loads "Philosophy" or "Capabilities" cards.
- `fetchSiteConfig()`: Loads global banner and spotlight settings.

### `src/lib/community.js`
Utility for community data:
- `fetchShowcase()`: Loads approved gallery items.
- `fetchGlobalPulse()`: Loads anonymized tap telemetry for the map.
- `fetchSpotlight()`: Loads the currently featured artisan mission.
- `fetchMarketingSolutions()`: Loads the high-impact "Mission" solution cards.

---

## 🛠️ Dynamic Solution Engine

The platform utilizes a "Mission-Based" sales strategy to overcome the Paradox of Choice.

### 1. `marketing_solutions` Table
- **Purpose:** Stores specific business use cases (Review Booster, Lead Magnet, etc.).
- **Visuals:** Each mission is paired with a `mock_image_url` showing the hardware "In the Wild."
- **Impact:** Every mission defines a specific "Business Impact" outcome.

### 2. High-Fidelity Mockups
Assets are stored in `/public/assets/mission_*.png`. These are generated lifestyle photos that bridge the gap between abstract tech and real-world results.

## 🎨 Community Features

### Showcase Gallery (`/showcase`)
A premium gallery displaying artisan missions. Includes filtering and "Artisan Spotlight" integration.

### Discovery Map (`/discovery`)
A global visualization of the SparkStation network using `SparkMap.jsx`. Shows real-time anonymized tap locations.

### Artisan Spotlight
A high-conversion section on the homepage featuring a moderated artisan setup.

---

## 🛡️ Security & Hardening

### Admin Authorization
Write access to all marketing and configuration tables is restricted via Postgres RLS:
```sql
-- Pattern for Admin Write Access
CREATE POLICY "Admin All" ON public.table_name
FOR ALL TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);
```

### Data Integrity (Fallbacks)
Most dynamic components implement a "Safety Net" pattern. If Supabase fails to return data, the component reverts to a hardcoded JSON fallback to ensure the site remains operational.

### Asset Protection
Hardware serial numbers and tap telemetry are protected. Taps are anonymized to `city/country` level before being served to the public Discovery Map.

---

## 🛠️ Key Components
- **`Dashboard.jsx`**: The monolithic controller for the user workshop and Platform Admin.
- **`Home.jsx`**: The dynamic landing page.
- **`App.jsx`**: Global routing and session management.
- **`Header.jsx`**: Integrated with `site_config` for the persistent banner.

### Identity & Discovery Hardening
- **Artisan Handles:** Profiles enforce a unique `username` constraint. Handles are validated in `MicrositeEditor.jsx` before save.
- **Privacy View:** Public discovery data is served via the `discoverable_profiles` Postgres view. This view automatically filters for users who have opted-in via the `is_public` toggle, ensuring private profiles are never leaked to the Artisan Directory.
- **RLS Enforcement:** Identity updates are restricted to the owner (`auth.uid() = id`).

### Webhook Resilience
- **Base64 Processing:** The `stripe-webhook.js` function is hardened to handle Netlify's base64-encoded request bodies. It dynamically detects encoding and ensures the raw buffer is provided to Stripe for signature verification.
- **Diagnostic Logging:** Enhanced logging in the Netlify function logs provides real-time visibility into body parsing and signature validation for production debugging.

---

## 📱 Mobile Optimization & Responsive Design

SparkStation prioritizes a "Tactical Mobile" experience, ensuring complex interactive features are preserved without compromising usability.

### 1. Interaction Shielding (The Map Overlay)
To prevent interactive elements like `SparkMap` from hijacking page scroll gestures on touch devices:
- **Pattern:** An `interaction-overlay` is placed over the canvas on mobile.
- **Trigger:** Users must tap the overlay to "Unlock" map interaction (`isInteracting = true`).
- **Logic:** This disables page scroll when the map is active and re-enables it when finished.

### 2. Tactical CSS Utilities
Standard helpers used throughout the platform:
- `.mobile-stack`: Stacks grid columns on small screens (e.g., Comparison Tables).
- `.mobile-scroll-x`: Converts vertical grids into horizontal swiping carousels.
- `.mobile-hide` / `.mobile-show`: Toggles visibility based on touch-primary vs. mouse-primary environments.

### 3. Touch-First Visibility
Patterns for elements that rely on `:hover` on desktop:
- **Rules:** Card descriptions and action buttons (e.g., in `Showcase.jsx`) must be visible by default or through large touch targets on mobile.
- **Implementation:** Use `md:opacity-0 md:group-hover:opacity-100` to hide on desktop while keeping `opacity-100` on mobile.

### 4. Status Indicators
- **Mobile Header:** Real-time system feedback (like "System Link Active") is condensed into a compact pulse-dot indicator next to the logo on small screens to save vertical space.

---

## 📈 Versioning
- **v1.1 (Identity Hardened):** Secure Identity Handles, Public Privacy Views.
- **v1.2 (Webhook Hardened):** Robust Base64 Webhook Patching, Diagnostic Logging.
- **v1.3 (Mobile Hardened):** Mobile Optimization, Interaction Shielding.
- **v1.4 (Current):** Dynamic Solution Engine, Mission Mockups, Polish & Troubleshooting Phase.
- **v1.5 (Planned):** FAQ CRUD Editor, Advanced Analytics Dashboard.
