# Password-Manager-Generator

Lightweight password manager full-stack example (Express API + React/Vite frontend).

Features
- Secure vault for storing encrypted credentials
- JWT auth for protected API routes
- Password strength checks and generator
- Simple, opinionated codebase for learning and extension

Repository structure

- password_manager_backend/: Node/Express API and services
- password_manager_frontend/: Vite + React user interface

Quick start (requirements)

- Node.js 18+ and pnpm installed
- A running MongoDB instance (local or remote)

Backend — setup

1. Open a terminal and install dependencies:

	cd password_manager_backend
	pnpm install

2. Configure environment variables. Copy or create an env file and set at minimum:

	- MONGO_URI — MongoDB connection string
	- JWT_SECRET — secret used to sign JWTs
	- PORT — optional server port (default 3000)

	See the backend config at password_manager_backend/config/env.js for details.

3. Run the backend in development:

	pnpm run dev

	(If your package.json uses different script names, use the appropriate start/dev script.)

Frontend — setup

1. Open a second terminal, install frontend deps:

	cd password_manager_frontend
	pnpm install

2. Start the frontend dev server:

	pnpm run dev

3. The frontend is built with Vite; to create a production build:

	pnpm run build

Running the app together

- Start the backend (API) and the frontend dev server. The frontend calls the API endpoints under the backend routes in `password_manager_backend/src/routes`.

Project notes

- API entry points: see password_manager_backend/src/server.js and password_manager_backend/src/app.js
- Frontend entry: password_manager_frontend/src/main.jsx and App.jsx
- Environment-specific configuration is in password_manager_backend/config and frontend Vite config in password_manager_frontend/vite.config.js

