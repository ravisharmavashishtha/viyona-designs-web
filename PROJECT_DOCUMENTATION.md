# Viyona Designs — Master Project & Brand Documentation

This document serves as an exhaustive reference manual for developers, brand managers, and AI assistants working on **Viyona Designs**. It outlines business identity, product catalogs, Amazon listing data, image assets, web architecture, and deployment procedures.

---

## ☁️ Cloud Brand Information Hub
* **Master Location:** `H:\My Drive\Website\brandinfo\`
* **Master Files:**
  - `BRAND_IDENTITY_GUIDELINES.md` — Core identity, positioning, typography, colors, packaging standards.
  - `PRODUCT_CATALOG.md` — Full active product catalog with dimensions, weights, HSN codes, and pricing.
  - `PRODUCT_CATALOG.json` — Machine-readable product catalog.
  - `AMAZON_LISTING_TEMPLATES.md` — Copy-paste ready titles, 5 bullets, and backend search terms.
  - `WEBSITE_DEPLOYMENT_GUIDE.md` — Architecture and deployment instructions.
  - `README.md` — Directory index and sync protocols.

---

## 🏢 1. Business & Brand Identity

* **Brand Name:** Viyona Designs
* **Tagline:** Thoughtfully Designed. Perfectly Made.
* **Founder & CEO:** Meenu Sharma
* **Mission:** Elevating everyday living through meticulously engineered, high-quality, eco-friendly plant-based products and modern home decor.
* **Primary Market:** India (Amazon India + Direct Website)
* **Official Website:** [https://viyonadesigns.com](https://viyonadesigns.com)
* **Packaging Standard:** Standard 5 x 5 x 5 inch gift shipping boxes.
* **Materials Standard:** Plant-based biodegradable bio-plastic (PLA / eco-friendly polymer).
* **Positioning Rule:** Position as a modern eco-luxury product brand. Never use "Design Studio" or raw hobbyist 3D-printing jargon.

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
* **Material:** Eco-Friendly Bio-Plastic Polymer
* **Color:** White
* **Key Features:** Adorable sleeping puppy design, catchall tray for coins/keys/paperclips, compact desktop decor.

---

### Product 2: Lord Ganesha Idol - Modern Minimalist Statue
* **ASIN:** `B0HF5124YZ`
* **SKU:** `VD-GANESHA-WHT-01`
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

---

## 💻 3. Technical Architecture & Stack

* **Framework:** React 18 + Vite
* **Router:** `react-router-dom` (HashRouter strategy for GitHub Pages compatibility)
* **Styling:** Vanilla CSS design system (`index.css` variables, clean responsive layout)
* **Hosting / Deployment:** GitHub Pages (`gh-pages` branch)
* **Build Script:** `npm run build && node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')"`
* **Deploy Command:** `npm run deploy`

---

## 🤖 4. Handoff Instructions for AI Assistants & Development Rules

### 🛡️ Core Git & Deployment Protocol (MANDATORY FOR ALL AI AGENTS)
1. **Feature Branch Isolation**: 
   - NEVER make direct changes or commit directly onto `master` for feature work.
   - Always create a new branch with a descriptive name before writing code: `git checkout -b feat/<feature-name>`.
2. **Pull Request Workflow**:
   - All changes made in feature branches must be committed with clear messages.
   - Push the branch and create a Pull Request (PR) targeted at `master`.
   - Merge into `master` only after verification and user review.
3. **Production Deployment Standard**:
   - **Deployments ONLY from `master`**: Never run `npm run deploy` from a feature branch or with uncommitted/dirty working files.
   - Switch to `master`, ensure working tree is 100% clean (`git status`), pull latest (`git pull origin master`), and only then run `npm run deploy`.
4. **Cloud Brandinfo Sync**:
   - Always synchronize changes with `H:\My Drive\Website\brandinfo\`.
