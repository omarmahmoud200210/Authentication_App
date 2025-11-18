# Auth System (no Passport)

This repository implements a lightweight authentication system backed by Express, MongoDB, and JWTs without using full-fledged frameworks such as Passport or NextAuth. Everything—from form handling to token generation, verification, refresh, and error handling—was built from the ground up so you can clearly see how each piece fits together.

## Features
- **Email/password signup and login** with bcrypt-hashed passwords stored in MongoDB.
- **JWT-based protection** (short-lived `access_token` + long-lived `refresh_token`) issued on login/registration, stored in secure HTTP-only cookies, and verified by middleware before rendering `/dashboard`.
- **Refresh endpoint** that consumes the refresh cookie, verifies it, and issues a new access token without forcing a logout.
- **Logout flow** that clears both cookies and redirects back to the login screen.
- **Tailwind-inspired views** (Dashboard, Login, Register, 401/403/404) that share `header`/`footer` partials for a consistent visual theme.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the `.env.example` values into `.env` (create it yourself), and supply your `MONGO_URL`, `JWT_SECRET`, and `REFRESH_TOKEN_SECRET`.
3. Start MongoDB (Atlas or local) and run the app:
   ```bash
   npm run dev
   ```
4. Visit `/auth/register` to create a user, `/auth/login` to obtain tokens, and `/dashboard` to see the protected UI.

## JWT flow (custom implementation)
- `login.controller.js` generates both the `access_token` (15m) and `refresh_token` (7d) and stores them in `httpOnly` cookies. 
- `services/jwt.js` checks for the `access_token` cookie (or `Bearer` header) and renders `errors/401`/`errors/403` on failure.
- `refresh.controller.js` consumes and verifies the refresh cookie, looks up the user, and rotates a fresh access token cookie so the dashboard stays accessible without re-authentication.

## Routes
- `/auth/register` – renders `register.ejs`, validates input, hashes passwords, and redirects to login.
- `/auth/login` – renders `login.ejs`, compares passwords with bcrypt, and redirects to `/dashboard` on success.
- `/dashboard` – protected by `verifyJWT`; renders browser-friendly data cards and the Logout button that submits to `/logout`.
- `/refresh` – used internally (or by an AJAX interceptor) to silently refresh the access token when it expires.
- `/logout` – clears JWT cookies and redirects to `/auth/login`.

## Error pages
Custom `401`, `403`, and `404` views live in `src/views/errors/` and reuse the same gradient card layout for a cohesive UX. The middleware renders them whenever a user lacks a token, access, or hits an unknown route.

## Testing
- Manually try sign-up and login flows to confirm cookies are set (`access_token`, `refresh_token`).
- Navigate to `/dashboard` without a token to trigger `errors/401`. Tamper with the cookie to provoke `errors/403`.
- Delete the dashboard route and access a non-existent URL to confirm the `404` layout renders.

## Notes
- No Passport, NextAuth, or similar middleware is used—just Express handlers, `jsonwebtoken`, and MongoDB models (`UserSchema`).
- Styles rely on Tailwind’s utility classes via CDN inside the shared `partials/header.ejs`.
