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

## Uploaded documents
Documents are saved by the backend into `backend/uploads`. They are saved on the computer/server where the backend is running, not directly onto an applicant's PC.


## Customer document uploads

The application upload form supports Aadhaar, PAN, salary slip, bank statement, and photograph uploads. Files are saved by the backend in `backend/uploads/` and exposed to the admin dashboard through `/uploads/<filename>`. The upload limit is 10 MB per file and accepted formats are PDF, JPG, JPEG, and PNG.

For a production deployment, uploaded files are saved on the backend server's filesystem; a browser cannot silently save a customer's files directly into a private folder on the admin's personal PC.
