## Local Docker Desktop setup - Compliance Dashboard

### Prerequisites

- Docker Desktop running (with enough memory/CPU for multiple containers).
- On Windows, WSL2 backend enabled in Docker Desktop.

### 1. Start the stack

From the `compliance-dashboard` directory:

```bash
docker compose up -d
```

This will start:
- `mongodb`, `redis`, `postgres`, `azurite`
- `dashboard-backend` (API) and `dashboard-frontend` (UI)
- `temporal` and `temporal-ui`
- `nginx` reverse proxy and dev tools (`adminer`, `redis-commander`)

### 2. Verify containers are healthy

```bash
docker ps
```

Ensure the following show `Up` and (ideally) `healthy`:
- `hawaii-tvr-mongodb`
- `hawaii-tvr-redis`
- `hawaii-tvr-postgres`
- `hawaii-tvr-azurite`
- `hawaii-tvr-dashboard-backend`
- `hawaii-tvr-dashboard-frontend`
- `hawaii-tvr-temporal`
- `hawaii-tvr-temporal-ui`
- `hawaii-tvr-nginx`

### 3. Hit health endpoints

You can use a browser or `curl`/`Invoke-WebRequest`:

- Nginx reverse proxy:
  - `http://localhost:8081/health` → should return `healthy`
- Backend API:
  - `http://localhost:3001/api/health`
- Temporal (optional for now):
  - Temporal UI: `http://localhost:8088` (may be unhealthy locally; safe to ignore when Temporal is disabled in the app)

### 4. Access the dashboard

- Frontend directly: `http://localhost:5173`
- Via Nginx (recommended): `http://localhost:8081`

### 5. Stopping the stack

From the `compliance-dashboard` directory:

```bash
docker compose down
```

