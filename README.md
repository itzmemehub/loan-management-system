# Loan Management System — Repaired

This package keeps the existing LoanFlow UI/design and repairs the broken project structure, routing, document upload paths, admin API protection, and SPA deployment configuration.

## 1. Backend
```powershell
cd backend
copy .env.example .env
npm install
npm start
```
Edit `backend/.env` first and set your MongoDB connection, JWT secret, and admin credentials.

## 2. Frontend
```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

For production:
```powershell
npm run build
```

The production files are generated in `frontend/dist`.

## Deployment
- Netlify: deploy the `frontend` folder; the included `_redirects` file prevents React route 404s.
- Vercel: deploy the `frontend` folder; `vercel.json` provides the SPA fallback.
- The Node/Mongo backend must be hosted separately on a server/runtime that supports Node.js and persistent storage.

### Railway + Netlify deployment

The easiest production setup for this repository is:

- Railway for the Express backend
- MongoDB Atlas for MongoDB
- Netlify for the Vite frontend

#### 1. Deploy the backend to Railway

1. Push this repository to GitHub and open [Railway](https://railway.com/new).
2. Create a project with **Deploy from GitHub repo**, then select this repository.
3. In the backend service settings, set **Root Directory** to `/backend`.
4. Railway should detect the Node app automatically. If it asks for commands, use:
   - Build: `npm install`
   - Start: `npm start`
5. In the service's **Variables** tab, add:

   ```text
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   JWT_SECRET=<long-random-secret>
   ADMIN_EMAIL=<admin-login-email>
   ADMIN_PASSWORD=<strong-admin-password>
   NODE_ENV=production
   CLIENT_ORIGIN=https://<your-netlify-site>.netlify.app
   ```

   Do not add a fixed `PORT`; Railway supplies it automatically. `CLIENT_ORIGIN` is the frontend address allowed to use the admin session (comma separate several).
6. Deploy the service. In **Settings > Networking**, click **Generate Domain**.
7. Open the generated URL. It should return the JSON message `Loan Management Backend Running`.

Before deploying, allow Railway to connect in MongoDB Atlas under **Network Access**. For a quick first deployment, `0.0.0.0/0` works; restrict it later if your MongoDB setup supports a narrower allowlist.

#### 2. Deploy the frontend to Netlify

1. Create a new Netlify site from the same GitHub repository.
2. Set **Base directory** to `frontend`.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `frontend/dist` (or `dist` when the base directory is applied).
5. Proxy the API through Netlify. Add these two lines at the **top** of `frontend/public/_redirects`, above the existing `/* /index.html 200` line, with your Railway domain from step 1:

   ```text
   /api/*      https://<your-railway-domain>/api/:splat      200
   /uploads/*  https://<your-railway-domain>/uploads/:splat  200
   ```

   Do **not** set `VITE_API_URL`; the frontend then calls `/api` on its own domain.
6. Deploy the site. The `/* /index.html 200` line keeps React routes working after refresh.

**Why the proxy:** the admin session is an HTTP-only cookie. Through the proxy the site and the API share one domain, so the cookie works in every browser, including Safari on iPhone, which blocks cookies from a different site.

**Without a proxy** (not recommended): set `VITE_API_URL=https://<your-railway-domain>/api` on Netlify and `COOKIE_SAMESITE=none` on Railway. Sign-in will not work in Safari. Vite variables are embedded at build time, so changing one needs a rebuild.

For Vercel, the equivalent is a `rewrites` entry in `frontend/vercel.json` mapping `/api/(.*)` and `/uploads/(.*)` to the Railway domain, placed before the catch-all.

#### Uploaded documents

Railway's normal container filesystem is not permanent: files in `backend/uploads` can disappear when the service is redeployed or moved. For real customer documents, use object storage such as S3-compatible storage or attach a Railway volume and update the upload storage path. Do not rely on the container filesystem as the only copy of uploaded documents.

## Customer document uploads

The application upload form supports Aadhaar, PAN, salary slip, bank statement, and photograph uploads. Files are saved by the backend in `backend/uploads/` and served at `/uploads/<filename>` **only to the signed-in admin** (the session cookie is required). The upload limit is 10 MB per file and accepted formats are PDF, JPG, JPEG, and PNG.

For a production deployment, uploaded files are saved on the backend server's filesystem; a browser cannot silently save a customer's files directly into a private folder on the admin's personal PC.
