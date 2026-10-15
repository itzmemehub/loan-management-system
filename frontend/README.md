# LoanFlow frontend

React 19 + Vite + React Router. Plain CSS, no framework: design tokens and the reset are in `src/styles/base.css`.

```powershell
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

The dev server proxies `/api` and `/uploads` to the backend on `http://localhost:5000` (override with `BACKEND_URL`), so the admin session cookie is first-party. Leave `VITE_API_URL` unset unless the API lives on another address.

## Folder structure

```
src/
├── main.jsx                  Entry: global styles, then <App />
├── app/
│   ├── App.jsx               All routes
│   ├── ProtectedRoute.jsx    Admin-only pages
│   └── ScrollManager.jsx     Scroll to top / to #section on every navigation
├── config/                   Business data, one source of truth
│   ├── loans.js              Loan types, indicative rates, limits, colour tone
│   └── documents.js          The five required documents
├── services/                 Talking to the outside world
│   ├── api.js                Axios client (sends the session cookie), 401 → sign in, sign out, file URLs
│   ├── auth.js               "Signed in" hint for the UI; the session itself is an HTTP-only cookie
│   └── localStore.js         Offline fallback: applications saved in the browser
├── utils/                    Pure helpers, no React
│   ├── format.js             ₹ amounts, dates
│   ├── emi.js                EMI formula
│   └── scroll.js             Smooth scroll that respects reduced motion
├── styles/                   Global CSS, imported once in main.jsx
│   ├── base.css              Tokens (colours, fonts), reset, page shell
│   ├── glass.css             Aurora background + .glass panels
│   └── ui.css                Buttons, fields, chips, alerts, pills, avatar
├── components/
│   ├── layout/               AppLayout (page shell), Navbar (header + mobile tab bar),
│   │                         Footer, Aurora, layout.css
│   └── ui/                   Guilloche (security-print linework)
└── pages/                    One folder per route; each owns its CSS
    ├── Home/                 HomePage, sections/*, useEmiCalculator, content.js
    ├── Apply/                ApplyPage, ApplySuccess
    ├── Login/                LoginPage
    ├── Dashboard/            DashboardPage
    └── LoanDetails/          LoanDetailsPage
```

## Where to change things

| To change… | Edit |
| --- | --- |
| Interest rates, loan limits, loan types | `src/config/loans.js` |
| Required documents | `src/config/documents.js` (and the backend model + upload route) |
| Home page FAQ or "how it works" copy | `src/pages/Home/content.js` |
| Colours, fonts | `src/styles/base.css` (`:root` tokens) |
| Header links / mobile tabs | `src/components/layout/Navbar.jsx` |
| Add a page | Create `src/pages/Name/NamePage.jsx`, wrap it in `<AppLayout>`, add a route in `src/app/App.jsx` |

## Conventions

- Every page renders inside `<AppLayout className="name-page">`, which adds the background, header, mobile tab bar and (with `withFooter`) the footer.
- Add `glass` to any element to make it a glass panel. `.glass` has zero specificity, so a component class can override its background, radius or shadow.
- Buttons are `btn` plus `btn-primary` (gold) or `btn-glass`.
- Phones (≤ 900px) get the app layout: no header, a bottom tab bar.
