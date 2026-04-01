# System Anatomy

A static website for system integrity monitoring, built with HTML, CSS, and Tailwind CSS.

## Local Development

Run the build script:
```bash
./build.sh
```

Start a local server:
```bash
python3 -m http.server 8000
```

Visit http://localhost:8000

## Deployment to Cloudflare Pages

This project is configured for automatic deployment to Cloudflare Pages via GitHub Actions.

### Setup

1. Create a Cloudflare Pages project named `system-anatomy` (or update the `projectName` in `.github/workflows/deploy.yml`).

2. In your GitHub repository settings, add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID.

3. Push to the `main` branch to trigger deployment.

### Files

- `index.html`: Landing page
- `command-center.html`: Dashboard
- `login.html`: Login page
- `stitch_screens/`: Design assets
- `build.sh`: Build script (no-op for static site)
- `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment