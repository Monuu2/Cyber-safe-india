# CyberSafe India

Flask app, restructured to deploy on Vercel via Git.

## Structure
```
.
├── api/
│   └── index.py       # Flask app - Vercel's Python runtime entrypoint
├── templates/          # Jinja templates (index, login, admin)
├── static/              # css/js/images
├── requirements.txt
└── vercel.json
```

## Deploy steps
1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Restructure for Vercel deploy"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to vercel.com -> Add New Project -> Import the GitHub repo.
   Vercel will detect `vercel.json` and use the Python runtime automatically.
   No extra build settings needed.
3. Before the first deploy, set these Environment Variables in the Vercel
   project settings (Settings -> Environment Variables):
   - `SECRET_KEY` — any long random string, used to sign Flask sessions.
   - `ADMIN_PASSWORD` — replaces the password that was previously hardcoded
     in `app.py` (`CyberSafe@2026`). Change it to something new.
   - `DATABASE_URL` — see the note below. Optional but recommended.
4. Deploy.

## Important: the database will not persist on Vercel as-is
The original app used a local SQLite file. Vercel's deployed filesystem is
read-only, and only `/tmp` is writable — and `/tmp` is wiped on every cold
start. Practically this means:
- The site will load and `GET /api/news` will work.
- Adding or deleting news through the admin panel will appear to work for
  that one request, but the data will not reliably survive to the next
  request, and will be wiped on redeploys or cold starts.

For the news CRUD (add/delete) to actually persist, point `DATABASE_URL` at
a real hosted Postgres database — Vercel Postgres, Neon, and Supabase all
have free tiers and work as drop-in replacements. Once `DATABASE_URL` is
set, `api/index.py` uses it automatically instead of SQLite. You'll also
need to add `psycopg2-binary` to `requirements.txt` in that case.

If you're fine with the site being read-mostly / demo-only, you can skip
this and just accept that admin edits won't stick.

## What changed from the original zip
- `backend/app.py` moved to `api/index.py` (Vercel's Python runtime expects
  the app in `/api`), with `template_folder` / `static_folder` pointed at
  the top-level `templates/` and `static/` folders.
- Hardcoded `secret_key` and admin password moved to environment variables
  (`SECRET_KEY`, `ADMIN_PASSWORD`), with the old hardcoded values kept only
  as local-dev fallbacks.
- SQLite path switched to `/tmp` when running on Vercel (`VERCEL` env var is
  set automatically by Vercel), since the rest of the filesystem is
  read-only there. Added optional `DATABASE_URL` support for a real DB.
- Dropped the one-off local maintenance scripts (`fix_admin.py`,
  `fix_css.py`, `fix_html.py`, `parse_admin.py`, `recover_admin.py`,
  `restore.py`, `restore_admin.py`) and the two committed `.db` files —
  none of these are needed for deployment and the scripts referenced local
  paths that don't apply on Vercel.
- `frontend/css.css` (an unused duplicate, not referenced by any template)
  was dropped; the real stylesheet is `static/css/style.css`.
