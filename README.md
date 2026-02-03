# Paris Guide 🗼

A beautiful, interactive guide to Paris with bilingual support (Portuguese & English). Submit tips, vote on favorites, and discover the best of the City of Light.

## Features

- 🌍 **Bilingual Support** - Portuguese (PT-BR) and English
- 📱 **Mobile-First Design** - Beautiful full-screen card interface
- 🎯 **Category Filtering** - Food, Transportation, Culture, Safety, City
- ⭐ **Voting System** - Upvote your favorite tips
- ✍️ **Community Submissions** - Users can submit their own tips
- 🔐 **Admin Panel** - Moderate submissions with language-aware operations
- 📧 **Email Notifications** - Automated updates for tip submissions
- 🎨 **Modern UI** - Dark mode, glassmorphism, smooth animations

## Prerequisites

- **Node.js** >= 24.12.0
- **npm** (comes with Node.js)

## Installation

1. **Install dependencies:**

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Generate a static site for deployment:

```bash
npm run generate
```

## Deployment to GitHub Pages

### Automated Deployment (Recommended)

The project uses **GitHub Actions** for automatic deployment. Every time you merge a pull request to the `main` branch, your site is automatically built and deployed.

**First-Time Setup:**

1. **Configure GitHub Pages:**
   - Go to your repository **Settings** → **Pages**
   - Set source to **Deploy from a branch**
   - Select branch: **gh-pages** and folder: **/ (root)**
   - Save the changes

2. **Push to main branch** - The GitHub Actions workflow will automatically deploy your site

Your site will be available at `https://[username].github.io/paris-guide/`

**Monitoring Deployments:**
- Go to the **Actions** tab in your repository to see deployment status
- Deployments typically complete in 2-3 minutes

### Manual Deployment (Backup)

If you need to deploy manually, run:

```bash
npm run deploy
```

This will:
1. Generate a static build (`npm run generate`)
2. Deploy the `.output/public` folder to the `gh-pages` branch
3. Make your site available at `https://[username].github.io/paris-guide/`

> **Note:** Replace `[username]` with your GitHub username. The base URL is configured in `nuxt.config.ts`.

For detailed deployment instructions, troubleshooting, and verification steps, see the [deployment workflow guide](.agent/workflows/deploy.md) or run `/deploy`.

## Project Structure

```
paris-guide/
├── assets/          # Styles and global assets
├── components/      # Vue components
├── data/           # JSON database files (tips-ptbr.json, tips-en.json)
├── pages/          # Page routes (index.vue, admin.vue)
├── server/         # API endpoints and utilities
│   ├── api/       # API routes
│   └── utils/     # Database and email utilities
├── stores/         # Pinia state management
├── types/          # TypeScript type definitions
└── utils/          # Client-side utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## Admin Panel

Access the admin panel at `/admin` to:
- Review pending submissions
- Approve or reject tips
- Edit existing tips
- Delete tips
- Switch between Portuguese and English databases

## Environment Variables

Create a `.env` file for email configuration (optional):

```env
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

## Tech Stack

- **Framework:** Nuxt 4
- **UI Library:** Nuxt UI (Tailwind CSS)
- **State Management:** Pinia
- **Database:** JSON files (file-based)
- **Email:** Nodemailer
- **Validation:** Zod
- **Deployment:** GitHub Pages

## License

Private project

## Contributing

This is a private project. For questions or suggestions, please contact the repository owner.
