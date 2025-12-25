# YOUWARE.md

## Provost Marshal Run Challenge Dashboard

This is a React + TypeScript application built with Vite and Tailwind CSS. It serves as a dashboard for the Provost Marshal Run Challenge 2026.

### Project Structure

- **`src/store/runStore.ts`**: Zustand store handling all application state (runners, logs, admin status). Uses `persist` middleware to save data to `localStorage`.
- **`src/types/index.ts`**: TypeScript interfaces for `Runner` and `RunLog`.
- **`src/components/`**:
  - `LeaderboardCard.tsx`: Displays top runners and top woman cards with updated titles (Fittest Provost 1-3, Fittest Provost Women).
  - `LeaderboardTable.tsx`: Displays the full ranking list with columns for Rank, Name, and Total KM. Shows top 5 by default with "View All" expansion. Includes Admin "Edit" buttons.
  - `RunnerLogs.tsx`: Displays a feed of recent run activities.
  - `AdminModal.tsx`: Password prompt for admin access.
  - `AdminPanel.tsx`: Admin interface for adding/editing runners and logs. Includes Gender selection for new runners.
- **`src/pages/`**:
  - `Dashboard.tsx`: The main single-page view assembling all components.
  - `ActivityLog.tsx`: Detailed view of daily activity (Jan 6 - Jan 31) with runner selection. Shows Total KM and Rank.

### Key Features

1.  **Live Leaderboard**: Automatically calculated from run logs. Sorts runners by Total KM.
2.  **Admin Mode**: Accessible via the "Admin" button (Password: `admin`). Allows:
    - Adding new runners (with Name and Gender).
    - Adding run logs for specific runners (supports "No Run" entry).
    - Deleting runners and logs.
    - Editing runners (UI placeholder in table).
3.  **Fittest Provost Rankings**: Highlights Top 3 overall (Fittest Provost 1, 2, 3) and Top Woman (Fittest Provost Women).
4.  **Data Persistence**: Data is saved to the browser's LocalStorage.

### Development Commands

- **Install dependencies**: `npm install`
- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview build**: `npm run preview`
- **Lint**: `npm run lint`

### Theme

- **Colors**:
  - Red: `provost-red` (#DC2626) - Primary accent color
  - Green: `green-500` (Tailwind default) - KM values
  - Black: `provost-black` (#000000) - Backgrounds
  - White: `provost-white` (#FFFFFF) - Text
  - Dark Gray: `provost-dark` (#1a1a1a) - Secondary backgrounds

### Future Improvements

- **Backend Integration**: Currently uses mock data and LocalStorage. For a real multi-user experience, integrate with a backend (e.g., Youbase/Supabase).
- **Runner Auth**: Implement individual runner login to allow them to view private stats if required.
- **Data Export**: Add functionality to export logs to CSV/Excel.
