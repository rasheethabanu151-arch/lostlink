# lostlink

## Deployment

Deploy `/backend` to Render using its Dockerfile and `/frontend` to Vercel. Configure these environment variables in the corresponding hosting dashboards; do not commit secret values.

Backend variables:

- Required: `DB_URL` (Neon JDBC URL), `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (at least 32 characters), and `CORS_ORIGIN` (comma-separated allowed frontend origins).
- Optional: `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

Frontend variable:

- `VITE_API_URL`: the backend base URL, without a trailing slash.

For keep-alive, configure an external uptime monitor or scheduled HTTP request to call `https://<backend-host>/api/health` every 10 to 14 minutes to reduce Render cold starts. To also keep Neon active, call `https://<backend-host>/api/health/db`; this public endpoint executes `SELECT 1`. Free-hosting sleep and database suspension behavior can still vary by provider.