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

* **Live WooCommerce Store:** [https://viyonadesigns.com](https://viyonadesigns.com) (Hostinger WordPress / WooCommerce)
* **Staging Store:** `https://mintcream-antelope-246402.hostingersite.com`
* **Static Frontend / Catalogue:** React 18 + Vite (GitHub Pages `gh-pages` branch)
* **Testing & QA Engine:** Playwright Headless Automation (Desktop & Mobile Viewport Matrix)
* **Backend Commerce Microservice:** Node.js Serverless on Vercel (`d:\DevSpace\viyona-commerce-backend`)

---

## 🧪 4. WooCommerce Development & Testing Workflow

### 🚀 On-Demand Testing Commands
* `npm run test:staging` — Executes full Playwright regression suite against Staging URL on demand.
* `npm run test:prod` — Runs safe, non-destructive health checks against Live Production on demand.
* `npm run test:report` — Opens the Playwright HTML test report.
* `npm run deploy:staging` — Deploys theme templates, CSS suites, and page components to Staging.
* `npm run deploy:prod` — Deploys approved changes to Live Production (gated by `ALLOW_PROD_MUTATION=true` / `--confirm-prod`).

### 🛡️ Core Git & Deployment Protocol (MANDATORY FOR ALL AI AGENTS)
1. **Feature Branch Isolation**: 
   - NEVER make direct changes or commit directly onto `master` for feature work.
   - Always create a new branch with a descriptive name before writing code: `git checkout -b feat/<feature-name>`.
2. **Staging Verification**:
   - Deploy and test changes on Staging environment first.
   - Trigger regression tests on demand: `npm run test:staging` or ask in chat.
3. **Pull Request Workflow**:
   - All changes made in feature branches must be committed with clean messages.
   - Push the branch and create a Pull Request (PR) targeted at `master`.
   - Merge into `master` only after verification and user review.
4. **Production Deployment Standard**:
   - **Deployments ONLY from `master`**: Never run `npm run deploy` or `npm run deploy:prod` from a feature branch.
   - Production deployment requires explicit user review and approval containing the `"approve"` keyword.
   - Run post-deploy live verification: `npm run test:prod`.
5. **Cloud Brandinfo Sync**:
   - Always synchronize changes with `H:\My Drive\Website\brandinfo\`.

