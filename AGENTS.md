# AGENTS.md

Tiny Express 5 + MongoDB CRUD API. One app, no tests, no lint/CI, no README.

## Commands

- `npm install` — required before anything (Node >= 20.19; enforced by the `mongodb` 7.x driver).
- `npm run dev` — nodemon server on `PORT` (default **5000**).
- `npm start` — plain `node index.js`.
- `npm test` — stub that always exits 1. There is no test suite; don't treat a failing `npm test` as a regression.

Verify changes by starting the server and hitting endpoints, e.g. `curl http://localhost:5000/users`. User IDs must be valid 24-hex Mongo `ObjectId` strings.

## Architecture

- `index.js` — only entrypoint. Creates the app, configures CORS, mounts the router at `/users`, and listens on `process.env.PORT || 5000`.
- `routes/users.route.js` — all routes (GET `/`, GET `/:id`, POST `/`, PATCH `/:id`, DELETE `/:id`).
- `lib/connectDB.js` — creates the `MongoClient` from `MONGODB_URI`, or from `DB_USER`/`DB_PASSWORD` when it is unset, then connects via **top-level `await` at import time** and exports the already-bound `usersCollection`. `index.js` never calls `connectToMongoDB` itself; importing the router triggers the connection. Keep that import chain intact when refactoring.
- Database name comes from `DB_NAME` (default `simple-crud`); collection is always `users`; the fallback Atlas cluster host is hardcoded in `connectDB.js`.
- If the DB connection fails, the module import throws before the server listens — startup failure usually means bad credentials or an unreachable cluster, not app code.

## Conventions and gotchas

- ESM throughout (`"type": "module"`): use `import`/`export`, and include `.js` in relative imports.
- Env loading is via `import "dotenv/config"` at the top of both `index.js` and `lib/connectDB.js`; keep at least one of those imports before any `process.env` use.
- New endpoints go in `routes/users.route.js` and use the exported `usersCollection`; don't open a new client per request. Validate `ObjectId.isValid(id)` before querying, and follow the existing `{ success: false, message }` error shape.
- Error responses currently mix `res.status().send({...})` with plain `res.send`; match surrounding style rather than introducing a new response abstraction.
- `.env` is **tracked in git** (`.gitignore` only excludes `/node_modules`) and stores live DB credentials. Never print its values, and don't add new secrets to tracked files.
- CORS always allows `http://localhost:3000` and `https://simple-crud-client-sigma.vercel.app`; add extra origins via the comma-separated `CLIENT_URLS` env var rather than editing the list for deployments.
- Production config is env-driven: set `MONGODB_URI` (or `DB_USER`/`DB_PASSWORD`), optional `DB_NAME` and `CLIENT_URLS`; hosts set `PORT`. `.env.example` documents all supported variables. No build step — deploy with `npm start`.
