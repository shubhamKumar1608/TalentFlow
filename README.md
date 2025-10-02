

# TalentFlow

TalentFlow is a modern, full-stack talent management platform for HR teams to manage jobs, candidates, and assessments. It provides a clean, responsive dashboard and a suite of tools to streamline the hiring process.

## Key Features

- **HR Dashboard:** Visualize hiring metrics, growth rates, and candidate statistics in a unified dashboard.
- **Job Management:** Post, edit, and manage job listings with ease.
- **Candidate Tracking:** Browse, filter, and manage candidate applications efficiently.
- **Assessment Builder:** Create, preview, and review candidate assessments.
- **Analytics:** Growth rate vs previous month, application stats, and more.
- **Mock API:** Uses MSW for realistic local development and testing.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router DOM
- Dexie (IndexedDB)
- MSW (Mock Service Worker)
- Axios

## Project Structure

```
src/
  components/      # UI components (cards, buttons, dashboard widgets)
  pages/           # Main pages (Dashboard, Jobs, Candidates, Assessments)
  services/        # Data, mocks, and API logic
  types/           # TypeScript types
  utils/           # Utilities and constants
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code

## Deployment

Deploy on Vercel, Netlify, or any static host supporting SPA routing.

---

**TalentFlow** – Streamlining talent management for modern HR teams.
