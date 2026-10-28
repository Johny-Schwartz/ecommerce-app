# E-Commerce App (MERN)

React + Bootstrap (frontend) · Node + Express (backend) · MongoDB (database)

## Run
1. Start MongoDB (local `mongod`, or set `MONGO_URI` to an Atlas string).
2. Backend:  `cd backend && npm install && npm start`   -> http://localhost:5000
3. Frontend: `cd frontend && npm install && npm run dev` -> http://localhost:5173

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/products?search= | View / search products |
| POST | /api/products | Add product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/orders | View orders |
| POST | /api/orders | Place order (validates + reduces stock, computes total) |
| PUT | /api/orders/:id/cancel | Cancel order (restores stock) |
