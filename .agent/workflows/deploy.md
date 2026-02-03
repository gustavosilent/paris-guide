---
description: Deploy Paris Guide to GitHub Pages
---

# Deployment to GitHub Pages

This guide explains how to deploy the Paris Guide application to GitHub Pages.

## Automated Deployment (Recommended)

The project uses GitHub Actions for automatic deployment.

### How it Works

- **Trigger:** Every push to the `main` branch (including merged pull requests)
- **Process:** GitHub Actions automatically builds and deploys the site
- **Duration:** Typically completes in 2-3 minutes
- **Workflow File:** `.github/workflows/deploy.yml`

### Steps After PR Merge

1. Merge your pull request to the `main` branch
2. GitHub Actions automatically triggers the deployment workflow
3. Monitor the deployment:
   - Go to your repository on GitHub
   - Click the **Actions** tab
   - Find the latest "Deploy to GitHub Pages" workflow run
   - Check the status and logs
4. Once complete, your changes are live at `https://[username].github.io/paris-guide/`

### First-Time Setup

Before the automated deployment works, configure GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: **gh-pages** and folder: **/ (root)**
5. Click **Save**
6. The site will be available at `https://[username].github.io/paris-guide/`

## Manual Deployment (Backup)

If you need to deploy manually (e.g., for testing or if GitHub Actions is unavailable):

// turbo
1. **Generate the static site:**
```bash
npm run generate
```

// turbo
2. **Deploy to GitHub Pages:**
```bash
npm run deploy
```

This will:
- Build the production site in `.output/public`
- Push the contents to the `gh-pages` branch
- Make your site available at `https://[username].github.io/paris-guide/`

## Verification

After deployment (automatic or manual), verify the site:

1. **Check deployment status:**
   - Go to repository **Settings** → **Pages**
   - Look for "Your site is live at..." message
   - Click the URL to visit the site

2. **Test functionality:**
   - Navigate between pages (Home, Admin)
   - Switch languages (Portuguese ↔ English)
   - Test tip submission
   - Test voting functionality
   - Verify all images and assets load correctly

3. **Check browser console:**
   - Open browser DevTools (F12)
   - Look for any errors in the Console tab
   - Verify no 404 errors for assets in the Network tab

## Troubleshooting

### Deployment Failed

**Check the GitHub Actions logs:**
1. Go to **Actions** tab in your repository
2. Click on the failed workflow run
3. Review the error messages in the logs
4. Common issues:
   - Node.js version mismatch (ensure it's 24.12.0)
   - Dependency installation failures (try clearing npm cache)
   - Build errors (check your code for syntax errors)

### Site Shows 404 Error

**Verify GitHub Pages settings:**
1. Go to **Settings** → **Pages**
2. Ensure source is set to `gh-pages` branch
3. Check that the repository is public (or you have GitHub Pro for private repos)

**Check baseURL configuration:**
1. Open `nuxt.config.ts`
2. Verify `baseURL` is set to `/paris-guide/` for production
3. Ensure the repository name matches the baseURL

### Assets Not Loading

**Check the browser console:**
1. Look for 404 errors on specific assets
2. Verify the paths are correct (should start with `/paris-guide/assets/`)

**Verify build output:**
1. Check `.output/public` folder after build
2. Ensure all assets are present in the `assets/` directory

### Changes Not Appearing

**Clear cache and hard reload:**
1. In your browser, press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Or clear browser cache manually

**Check deployment timestamp:**
1. Go to **Actions** tab
2. Verify the latest workflow completed successfully
3. Check the timestamp matches your latest commit

## Advanced: Rolling Back

If you need to revert to a previous version:

1. **Find the commit hash** of the working version
2. **Reset your main branch:**
   ```bash
   git reset --hard <commit-hash>
   git push --force origin main
   ```
3. GitHub Actions will automatically redeploy the reverted version

> ⚠️ **Warning:** Force pushing can cause issues for collaborators. Coordinate with your team before doing this.
