# Deployment Guide for TalentFlow

This project is a Vite + React + TypeScript app. You can deploy it to any static hosting provider. Here are the recommended steps for Vercel and Netlify:

## 1. Build the Project

Open your terminal and run:

```
npm run build
```

This will generate a `dist` folder with your production-ready static files.

## 2. Deploy to Vercel (Recommended)

- Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
- Click **New Project** and import your TalentFlow repository.
- Vercel will auto-detect the Vite setup. Use the default build command (`npm run build`) and output directory (`dist`).
- Click **Deploy**. Your app will be live in seconds.

**Or, use the Vercel CLI:**

```
npm i -g vercel
vercel
```

Follow the prompts to deploy.

## 3. Deploy to Netlify

- Go to [netlify.com](https://netlify.com/) and sign in.
- Click **Add new site** > **Import an existing project**.
- Connect your repo, set build command to `npm run build` and publish directory to `dist`.
- Or, drag and drop the `dist` folder in the Netlify dashboard.

## 4. Other Static Hosts

- Upload the contents of the `dist` folder to any static file host (GitHub Pages, Firebase Hosting, Surge, etc.).

## 5. SPA Routing (Important)

If you use client-side routing (like React Router), add a redirect for all routes to `index.html`:

- **Netlify:** Add a `_redirects` file in `public/` with:
  ```
  /*    /index.html   200
  ```
- **Vercel:** No extra config needed for SPA routing.

---

Your app is now ready for production!
