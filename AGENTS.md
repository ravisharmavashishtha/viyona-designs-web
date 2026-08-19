# AI Developer & Agent Workflow Rules

Every AI assistant or developer working in this repository MUST follow these rules:

## 1. Feature Branch Rule
- **Never develop directly on `master`.**
- For any new feature, bugfix, or redesign, immediately create a branch:
  ```bash
  git checkout -b feat/<descriptive-name>
  # or
  git checkout -b fix/<descriptive-name>
  ```

## 2. Pull Request & Merge Workflow
- Commit all code, styles, and assets with clean, semantic commit messages.
- Push the branch to the remote:
  ```bash
  git push -u origin <branch-name>
  ```
- Open a Pull Request (PR) against `master`.
- Once verified and approved, merge the PR into `master`.

## 3. Production Deployment Rule (gh-pages)
- **Live deployments MUST ONLY happen from the `master` branch.**
- Never run `npm run deploy` from an uncommitted working tree or from a feature branch.
- Deployment checklist:
  1. Ensure you are on `master`: `git checkout master`
  2. Pull latest merged changes: `git pull origin master`
  3. Ensure working tree is clean: `git status`
  4. Run deploy: `npm run deploy`

## 4. Brand Information & Cloud Sync Rule (`H:\My Drive\Website\brandinfo`)
- All master brand guidelines, product catalogs (Markdown & JSON), Amazon listing copies, and deployment manuals are stored at `H:\My Drive\Website\brandinfo\`.
- Whenever any change is made to brand identity, product details, pricing, keywords, or images, the files in `H:\My Drive\Website\brandinfo\` MUST be updated concurrently.

## 5. Social Media Publishing Approval Rule
- **NEVER post or publish any content to social media (Instagram, Facebook, etc.) without explicit user review.**
- Always draft and present the proposed visual asset, caption, hashtags, and links in the chat first.
- **ONLY execute the live publishing action when the user explicitly provides approval containing the keyword `"approve"`** (e.g. *"approve"*, *"approved"*, *"I approve"*).

