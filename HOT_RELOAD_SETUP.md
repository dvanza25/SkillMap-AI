# Hot-Reload Development Setup

Your Docker setup is now configured for hot-reloading! Here's what changed:

## Changes Made

### Backend (Django)
- **Development Server**: Now runs `python manage.py runserver` instead of Gunicorn
- **Auto-reload**: Django's development server automatically reloads when Python files change
- **Volume Mount**: The entire `./backend` directory is mounted, watching all changes
- **Port**: Still runs on `8000`

### Frontend (React + Vite)
- **New Dockerfile**: Created `frontend/Dockerfile.dev` for development
- **Vite Dev Server**: Runs with HMR (Hot Module Replacement) enabled
- **Volume Mounts**: Watches `src/` and `index.html` for changes
- **Port**: Changed to `5173` (Vite's default dev port)

## How to Use

1. **First time or after dependencies change**:
   ```powershell
   docker compose down
   docker compose up -d --build
   ```

2. **For regular development** (just code and save):
   ```powershell
   docker compose up -d
   ```
   Changes are detected automatically!

3. **View logs** to see hot-reload in action:
   ```powershell
   docker compose logs -f backend    # Watch Django reload
   docker compose logs -f frontend   # Watch Vite HMR
   ```

## Accessing Your App

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432

## Important Notes

⚠️ **For Production**: This setup uses Django's development server which is NOT suitable for production. The original `Dockerfile` (using Gunicorn) should be used for production builds.

The `frontend/Dockerfile` (production) is still available if you want to build the production frontend image.

## Troubleshooting

- **Changes not reflecting**: Check that files are in the watched paths (`src/` and `index.html` for frontend)
- **Port already in use**: Change the port mapping in `docker-compose.yml`
- **Database issues**: Run `docker compose down` to clear data and restart fresh
