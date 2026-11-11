# Dr Mehta Wellness — API starter

This folder adds a Node.js + Express + MongoDB API starter to the HTML/CSS/JavaScript website and team portal.

## Included
- Email/password login with bcrypt password hashing
- HTTP-only session cookie and logout/current-user endpoints
- Role checks for admin, doctor, nutritionist, yoga and meditation roles
- Patient create, search and profile endpoints
- Chronological care entries (consultation, medical report metadata, nutrition, yoga, meditation, follow-up)
- Basic audit events for logins and patient/care/team operations
- Helmet security headers, CORS allow-list, login rate limiting and request validation

## Run locally
1. Install Node.js 20+ and MongoDB (local MongoDB or a managed MongoDB deployment).
2. Copy `.env.example` to `.env`.
3. Set a strong random `JWT_SECRET` (32+ characters), `MONGODB_URI`, `FRONTEND_ORIGIN`, and a one-time bootstrap admin email/password.
4. From this folder run `npm install`, then `npm run dev`.
5. API health check: `http://localhost:4000/api/health`.

The bootstrap admin is created only when that email does not already exist. Change its initial password and remove bootstrap credentials from the deployment environment after setup.

## API outline
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/patients?q=DM-2048`
- `POST /api/patients` (admin/doctor)
- `GET /api/patients/:id` (patient plus care entries)
- `POST /api/patients/:id/entries`
- `GET /api/team` (admin)
- `POST /api/team` (admin)

Authenticated requests use the `dmw_session` HTTP-only cookie. For local cross-origin development, serve the frontend and configure `FRONTEND_ORIGIN` to that exact origin. Keep frontend and API on HTTPS in production.

## Important healthcare-data boundary
This is a development starter, not a certified or production-ready electronic medical record system. Do not enter real patient information yet. Before handling real health data, arrange a security and privacy review, encryption at rest and in transit, managed secrets, backups and restore tests, private encrypted object storage for report files, malware scanning, retention/deletion workflows, access reviews, stronger audit monitoring, consent and privacy notices, incident response, and legal/compliance review for the locations where the service operates. The current API intentionally does not implement medical-file uploads. Do not store report files in a public web directory.
