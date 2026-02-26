# MERN Mini-CRM — Backend

## Live API URL
https://your-backend.onrender.com/api

## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication (Access + Refresh Token)
- bcrypt password hashing
- Rate limiting (3 requests / 10 min)

## Setup Instructions
1. Clone the repo
   git clone https://github.com/username/mern-crm-backend.git
   cd mern-crm-backend

2. Install dependencies
   npm install

3. Create .env file
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   PORT=5000
   NODE_ENV=development

4. Run the server
   npm run dev

## Run Tests
   npm test

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Contacts
- GET    /api/contacts
- POST   /api/contacts
- GET    /api/contacts/:id
- PUT    /api/contacts/:id
- DELETE /api/contacts/:id
- GET    /api/contacts/export

### Activities
- GET /api/activities

## Architecture
React Frontend → Express REST API → MongoDB Atlas
JWT: Access Token (15min) + Refresh Token (7 days, httpOnly cookie)