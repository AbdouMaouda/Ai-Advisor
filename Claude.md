Create a CLAUDE.md file at the project root with the following content:

# Project Overview
AI SaaS platform. Spring Boot backend, React + Vite frontend.

# Structure
/backend  → Spring Boot (Java), runs on port 8080
/frontend → React + Vite, runs on port 5173

# Backend
- Java 17, Maven
- Spring Security for auth
- Clerk JWT validation for all protected routes
- DB: PostgreSQL
- Env vars in application.properties

# Frontend
- React 18, Vite
- Clerk for auth (@clerk/clerk-react)
- Axios for all API calls, base instance in src/api/client.js
- Routing via React Router v6
- Tailwind CSS

# API
- All backend calls go through the Axios base instance
- Auth header (Bearer token) attached via Axios interceptor
- Base URL: http://localhost:8080

# Key conventions
- New pages go in src/pages/
- Reusable components go in src/components/
