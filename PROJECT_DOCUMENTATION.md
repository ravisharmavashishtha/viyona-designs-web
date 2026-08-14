# Viyona Designs — Master Project & Brand Documentation

This document serves as an exhaustive reference manual for developers, brand managers, and AI assistants working on **Viyona Designs**. It outlines business identity, product catalogs, Amazon listing data, image assets, web architecture, and deployment procedures.

---

## 🏢 1. Business & Brand Identity

* **Brand Name:** Viyona Designs
* **Tagline:** Thoughtfully Designed. Perfectly Made.
* **Mission:** Elevating everyday living through meticulously engineered, high-quality, eco-friendly 3D-printed products and home decor.
* **Primary Market:** India (Amazon India + Direct Website)
* **Official Website:** [viyonadesigns.com](https://viyonadesigns.com)
* **Packaging Standard:** Standard 5 x 5 x 5 inch shipping boxes.
* **Materials Standard:** Plant-based biodegradable bio-plastic (PLA/Eco-friendly polymer).

---

## 📦 2. Active Product Portfolio & Amazon Listings

### Product 1: Sleeping Puppy Desk Organizer
* **ASIN:** `B0HC36C861`
* **SKU:** `GEN-PUPPY-TRAY-WHT`
* **Brand Name:** Generic / Viyona Designs
* **Amazon Link:** [https://www.amazon.in/dp/B0HC36C861](https://www.amazon.in/dp/B0HC36C861)
* **Selling Price:** ₹499.00 | **M.R.P.:** ₹999.00
* **HSN Code:** `39261019`
* **Dimensions (Item):** 14.1 cm (L) x 9.5 cm (W) x 5.2 cm (H)
* **Dimensions (Package):** 5 x 5 x 5 inches | **Package Weight:** 110 grams
* **Material:** Eco-Friendly Plastic
* **Color:** White
* **Key Features:** Adorable sleeping puppy design, catchall tray for coins/keys/paperclips, compact desktop decor.

---

### Product 2: Lord Ganesha Idol - Modern Minimalist Statue
* **ASIN:** `B0HF5124YZ`
* **SKU (White):** `VD-GANESHA-WHT-01`
* **SKU (Pink Variant):** `VD-GANESHA-PNK-01`
* **Brand Name:** Viyona Designs *(Listed via GTIN Exemption)*
* **Amazon Link:** [https://www.amazon.in/dp/B0HF5124YZ](https://www.amazon.in/dp/B0HF5124YZ)
* **Selling Price:** ₹550.00 | **M.R.P.:** ₹1,199.00 (-54% off)
* **HSN Code:** `39264011` *(Plastic Statuettes & Ornamental Articles)*
* **Product Type:** `STATUE` / `FIGURINE`
* **Browse Node:** `Home & Kitchen > Home Décor > Spiritual & Religious Décor > Idols & Figurines`
* **Item Dimensions:** 5.4 cm (L) x 7.3 cm (W) x 10.3 cm (H)
* **Item Weight:** 45 Grams | **Package Weight:** 150 Grams
* **Package Dimensions:** 5 x 5 x 5 inches
* **Material:** 100% Plant-Based Biodegradable Bio-Plastic
* **Finish:** Natural Smooth Matte White

#### Amazon Listing Copy (Bullet Points):
1. **MODERN & MINIMALIST ELEGANCE:** Beautifully crafted Lord Ganesha idol featuring crisp, modern aesthetic lines that bring peace, prosperity, and divine energy to any space.
2. **PRECISION CRAFTSMANSHIP:** Manufactured with high-precision engineering for intricate details, smooth curves, and a premium tactile feel.
3. **VERSATILE PLACEMENT:** Compact and lightweight design makes it ideal for car dashboards, study tables, office desks, living room displays, or pooja rooms.
4. **100% ECO-FRIENDLY & BIODEGRADABLE:** Made from premium plant-based biodegradable bio-plastic. Durable, non-toxic, lightweight, impact-resistant, and completely safe for your home and environment.
5. **PERFECT DIVINE GIFT:** Comes thoughtfully designed as an auspicious, sustainable gift for housewarmings, festivals (Ganesh Chaturthi, Diwali), weddings, or corporate gifting.

#### Backend Search Terms:
```text
lord ganesha idol statue ganpati bappa vinayaka murti eco friendly biodegradable plastic plant based home decor car dashboard mandir temple office desk spiritual gift housewarming pooja room decorative figurine white pink generic viyona designs
```

---

## 🖼️ 3. Asset Directories & Image Registry

### Web Assets (`public/images/`)
These images are stored in the website codebase and served publicly:
* `/images/puppy_front.jpg` — Sleeping Puppy Front View
* `/images/puppy_angled.jpg` — Sleeping Puppy Angled View
* `/images/puppy_top.jpg` — Sleeping Puppy Top View
* `/images/ganesha_front.jpg` — Lord Ganesha Front View (White)
* `/images/ganesha_right.jpg` — Lord Ganesha Right 3/4 View (White)
* `/images/ganesha_left.jpg` — Lord Ganesha Left Profile View (White)
* `/images/ganesha_back.jpg` — Lord Ganesha Back View (White)

### Source & High-Res Amazon Image Pack (`D:\Downloads\`)
* **Ganesha Raw Files:** `D:\Downloads\Ganesha Model\Images\` (`front.webp`, `right.webp`, `left.webp`, `back.webp`)
* **Ganesha Amazon White Background Pack:** `D:\Downloads\Ganesha Model\generatedimages\`
  * `ganesha_white_front.jpg` (RGB 255,255,255 Pure White)
  * `ganesha_white_right.jpg` (RGB 255,255,255 Pure White)
  * `ganesha_white_left.jpg` (RGB 255,255,255 Pure White)
  * `ganesha_white_back.jpg` (RGB 255,255,255 Pure White)
  * `ganesha_pink_front.jpg` (Pink Color Variation)

---

## 💻 4. Technical Architecture & Stack

* **Framework:** React 18 + Vite
* **Router:** `react-router-dom` (HashRouter strategy for GitHub Pages compatibility)
* **Styling:** Vanilla CSS design system (`index.css` variables, clean responsive layout)
* **Hosting / Deployment:** GitHub Pages (`gh-pages` branch)
* **Build Script:** `npm run build && node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')"`
* **Deploy Command:** `npm run deploy`

### Data Flow
Products are centrally defined in `src/data/products.js`. Both `Home.jsx` and `ProductDetail.jsx` dynamically import from this single source of truth.

---

## 🤖 5. Handoff Instructions for AI Assistants & Development Rules

### 🛡️ Core Git & Deployment Protocol (MANDATORY FOR ALL AI AGENTS)
1. **Feature Branch Isolation**: 
   - NEVER make direct changes or commit directly onto `master` for feature work.
   - Always create a new branch with a descriptive name before writing code: `git checkout -b feat/<feature-name>` (or `fix/<fix-name>`).
2. **Pull Request Workflow**:
   - All changes made in feature branches must be committed with clear messages.
   - Push the branch and create a Pull Request (PR) targeted at `master`.
   - Merge into `master` only after verification and user review.
3. **Production Deployment Standard**:
   - **Deployments ONLY from `master`**: Never run `npm run deploy` from a feature branch or with uncommitted/dirty working files.
   - Switch to `master`, ensure working tree is 100% clean (`git status`), pull latest (`git pull origin master`), and only then run `npm run deploy`.
4. **Local Verification**:
   - Always test changes locally on `npm run dev` in the feature branch before creating a PR or requesting a merge.

---

## 📝 6. Standard Procedures

1. **Adding a New Product:**
   - Create a feature branch: `git checkout -b feat/add-<product-id>`.
   - Add product object to `src/data/products.js` with `id`, `name`, `shortDesc`, `description`, `bullets`, `amazonLink`, `images`, and `specs`.
   - Place white-background images in `public/images/`.
   - Commit all changes, merge into `master`, and deploy from `master`.
2. **Amazon Content Writing:**
   - Avoid mentioning "3D printed" in titles/bullets; emphasize **"Plant-based Biodegradable Bio-Plastic"** and **"Eco-Friendly Precision Engineering"**.
   - Standard main image requirement: Pure white background `#FFFFFF` (RGB 255, 255, 255) with zero borders or text.

