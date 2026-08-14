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
