# System Anatomy

A static website for system integrity monitoring, built with HTML, CSS, and Tailwind CSS.

## Authentication System

This application implements a secure, passwordless authentication system:

### Authentication Methods
- **Google Workspace SSO**: OAuth integration with Google Workspace
- **Microsoft Entra SSO**: OAuth integration with Microsoft Azure AD
- **Email Link Authentication**: Passwordless login via secure email links

### Security Features
- No password storage (passwordless design)
- OAuth 2.0 compliant SSO flows
- JWT-based email link authentication
- 24-hour session management
- Automatic session expiry and cleanup
- Protected route guards

### Implementation Notes
- **Production**: Integrate with Firebase Auth, Auth0, or AWS Cognito
- **Current**: Client-side simulation for demonstration
- **Session Storage**: Uses localStorage (use HTTP-only cookies in production)

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

## Testing Authentication

Visit `auth-test.html` to test the authentication workflow:
- Direct access to protected pages
- Authentication state checking
- Session management

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
- `command-center.html`: Dashboard (protected)
- `login.html`: Authentication page
- `stitch_screens/`: Design assets
- `build.sh`: Build script (no-op for static site)
- `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment