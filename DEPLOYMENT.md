# Render Deployment Guide

This guide walks you through deploying the **AI-Driven Web Application Security Suite** to [Render](https://render.com).

The project is structured into two decoupled tiers:
- **Backend API**: Node.js / Express Web Service located in the `backend/` directory.
- **Frontend App**: Vite / React Single Page Application (Static Site) located in the `frontend/` directory.

---

## Prerequisites: Cloud MySQL Database

Render's native managed database is PostgreSQL. Because this application uses MySQL, you can use any free cloud MySQL database:
- **[Aiven for MySQL](https://aiven.io/)** (Free tier available)
- **[TiDB Cloud](https://tidbcloud.com/)** (Free serverless MySQL tier)
- **[Clever Cloud](https://www.clever-cloud.com/)** (Free MySQL addon)
- **AWS RDS** or **DigitalOcean Managed Databases**

Obtain your cloud database credentials:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT` (typically `3306`)

---

## Method 1: Manual Dashboard Setup (Recommended)

### Step 1: Deploy Backend Web Service

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `security-suite-backend` |
| **Region** | Choose nearest to you / your DB |
| **Branch** | `main` (or `master`) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

5. Under **Advanced** $\rightarrow$ **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `JWT_SECRET` | *(Random 32+ character string)* | Secret for signing auth tokens |
| `DB_HOST` | `your-db-host.com` | Cloud MySQL host |
| `DB_USER` | `your-db-user` | Cloud MySQL user |
| `DB_PASSWORD` | `your-db-password` | Cloud MySQL password |
| `DB_NAME` | `security_suite` | Database name |
| `DB_PORT` | `3306` | MySQL port |
| `DB_SSL` | `true` | Required for most cloud DBs |
| `CLIENT_URL` | *(Leave empty for now; fill in after Step 2)* | Allowed frontend URL for CORS |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API key for AI threat analysis |

6. Under **Advanced** $\rightarrow$ **Health Check Path**, enter: `/health`.
7. Click **Create Web Service**.
8. Once deployed, note down your backend URL (e.g. `https://security-suite-backend.onrender.com`).

---

### Step 2: Deploy Frontend Static Site

1. In Render Dashboard, click **New +** $\rightarrow$ **Static Site**.
2. Select the same GitHub repository.
3. Fill in the following settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `security-suite-frontend` |
| **Branch** | `main` (or `master`) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Under **Advanced** $\rightarrow$ **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://security-suite-backend.onrender.com` | Your deployed backend URL from Step 1 |

5. Under **Redirects/Rewrites**, ensure the SPA rewrite is present:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(Note: The project also includes `frontend/public/_redirects` which handles this automatically).*
6. Click **Create Static Site**.
7. Once deployed, copy your frontend URL (e.g. `https://security-suite-frontend.onrender.com`).

---

### Step 3: Link Frontend URL in Backend CORS

1. Go back to your `security-suite-backend` service in Render.
2. Navigate to **Environment**.
3. Set `CLIENT_URL` to your frontend URL:
   ```
   CLIENT_URL=https://security-suite-frontend.onrender.com
   ```
4. Save Changes $\rightarrow$ Render will automatically redeploy the backend with the new CORS setting.

---

## Method 2: One-Click Render Blueprint

The repository includes a ready-to-use [`render.yaml`](render.yaml).

1. In Render Dashboard, click **New +** $\rightarrow$ **Blueprint**.
2. Connect your GitHub repository.
3. Render will read `render.yaml` and prompt you to input the database credentials and `VITE_API_URL`.
4. Click **Apply** to deploy both services simultaneously.

---

## Verification Checklist

- [ ] Backend `/health` returns `{"status":"healthy"}`.
- [ ] Backend `/` returns `{"status":"online"}`.
- [ ] Frontend loads the landing page and navigation bar.
- [ ] User registration works and stores bcrypt-hashed passwords.
- [ ] User login generates a valid JWT token stored in browser localStorage.
- [ ] Website security scan executes and returns scores, SSL details, and security headers.
- [ ] Dashboard displays user-specific risk distribution charts.
- [ ] PDF report download generates the exact requested scan report.
- [ ] Refreshing pages (`/dashboard`, `/history`, `/reports`) does not return 404.
