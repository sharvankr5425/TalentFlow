TalentFlow - A Mini Hiring Platform

This is a front-end React application built to simulate a hiring platform for an HR team, as specified in the technical assignment. The entire application is self-contained within App.jsx and runs completely in the browser without a real backend.

Features
Jobs Board: Create, edit, archive, and reorder jobs with drag-and-drop. Includes server-like pagination and filtering.

Candidates Hub: View a virtualized list of 1,000+ candidates with efficient client-side searching and filtering.

Candidate Profiles: Deep-dive into a candidate's profile to see their details and a timeline of their progress.

Hiring Pipeline (Kanban): A drag-and-drop Kanban board for each job to visually move candidates through hiring stages.

Assessment Builder: A powerful tool to create custom job-specific assessments with various question types (text, multiple-choice, numeric, etc.).

Live Assessment Preview: See how the assessment will look to a candidate in real-time as you build it.

Conditional Logic: Configure questions in the assessment to only appear based on answers to previous questions.

Technical Decisions & Architecture
1. Single-File Structure (App.jsx)
To meet the project constraints, the entire application—including all components, logic, API mocking, and database setup—is contained within a single App.jsx file. This demonstrates the ability to organize a complex application within given limitations. In a real-world scenario, this would be split into a modular file structure.

2. "No Backend" - API & Data Layer
API Mocking (Mock Service Worker - MSW): MSW is used to intercept network requests (fetch) and simulate a real REST API. This allows the front-end code to be written as if it's communicating with a real server, making it highly portable.

Artificial Latency & Errors: The MSW handlers intentionally introduce random delays (200-1200ms) and a 5-10% error rate on write operations (POST, PATCH, PUT) to simulate real-world network conditions and test the UI's resilience.

Local Persistence (Dexie.js over IndexedDB): All data is persisted locally in the browser's IndexedDB.

Why Dexie?: Dexie.js provides a clean, promise-based wrapper around the IndexedDB API, making it much easier to define schemas, query data, and handle complex operations. It acts as our "database."

Data Flow: When the app starts, data is seeded into IndexedDB if it's empty. All "API" calls from the components are caught by MSW, which then reads from or writes to the Dexie database. This ensures data persists across page refreshes.

3. State Management
React Hooks: The application relies exclusively on React Hooks for state management (useState, useEffect, useCallback, useMemo, useContext).

Global Context for Notifications: A simple React Context (AppContext) is implemented to provide a global addNotification function. This allows any component to trigger success or error toast notifications without prop drilling.

4. Routing
Custom Hook-Based Router: A simple routing solution is implemented using the useState and useEffect hooks to listen to browser history events (popstate) and the History API (pushState). This avoids the need for an external library like React Router, keeping the project dependency-free and self-contained.

5. Performance Optimization
Virtualized List (React Window): The candidates' list, with its 1,000+ items, is rendered using react-window. This is crucial for performance, as it only renders the items currently visible in the viewport, preventing the DOM from being overloaded. react-virtualized-auto-sizer is used to make the list responsive to its container size.

Client-Side Filtering: For the large candidate list, all data is fetched once, and filtering/searching is performed on the client-side. This provides an instantaneous user experience. For the jobs list, filtering is "server-like," meaning it re-fetches from the mock API with query parameters.

6. UI & UX
Styling (Tailwind CSS): The UI is built using Tailwind CSS for rapid, utility-first styling. This keeps the markup clean and the design consistent.

Drag-and-Drop (React Beautiful DnD): This library is used for both reordering jobs and the Kanban board. It provides a great user experience with clear visual feedback.

Optimistic Updates: When reordering jobs or moving candidates, the UI updates instantly before the API call completes. If the API call fails (which it will, randomly, by design), the UI reverts to its original state and shows an error notification. This makes the application feel fast and responsive.

Getting Started
Prerequisites: You need Node.js and a package manager (like npm or yarn) installed.

Setup: This project is bootstrapped with Create React App.

Clone the repository.

Run npm install to install dependencies like React, MSW, Dexie, etc.

Run npm start to start the development server.

Usage: Open your browser to http://localhost:3000. The application will initialize, seed the local database on the first run, and be ready to use.