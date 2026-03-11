# ChandaBaz - Corruption Reporting Platform

> _"Exposing corruption through verified public evidence."_

ChandaBaz is a web platform where people can report corruption happening around them. You can upload photos, videos, and documents as proof. Every report goes through an admin review before it becomes public, so only real, verified reports are shown on the site. You can also report anonymously if you don't want to show your name.

---

## What Can You Do With It?

- **Submit a report:** Write about what happened, where it happened, and attach photos or videos as proof.
- **Stay anonymous:** If you're scared to share your name, you can hide it. Nobody will know who you are.
- **Browse verified reports:** See corruption cases that have been checked and approved.
- **View a heatmap:** A live map that shows where corruption is happening most in Bangladesh.
- **Download a receipt:** Every approved report gets a unique receipt ID (like `CB-4A3F2D-2026`). You can download it as a PDF.
- **Admin panel:** Admins can approve or reject reports, manage users, and see platform stats.

---

## Tech Stack

| Part           | What We Used                 |
| -------------- | ---------------------------- |
| Frontend       | React 18, Vite, Tailwind CSS |
| Backend        | Node.js, Express.js          |
| Database       | MongoDB Atlas (via Mongoose) |
| File Storage   | Cloudinary                   |
| Authentication | JWT (JSON Web Tokens)        |
| PDF Export     | jsPDF + html2canvas          |
| Maps           | Leaflet + React Leaflet      |
| Icons          | Lucide React                 |
| Notifications  | react-hot-toast              |

---

## Project Structure

```
IP/
├── chandabaz_backend/      ← The server (API)
│   ├── config/             ← Database & Cloudinary setup
│   ├── controllers/        ← Business logic
│   ├── middleware/         ← Auth checks, file upload
│   ├── models/             ← Database schemas
│   ├── routes/             ← API endpoints
│   └── server.js           ← Main server file
│
└── chandabaz_frontend/     ← The website (UI)
    ├── public/             ← Logo, favicon
    └── src/
        ├── components/     ← Reusable UI pieces
        ├── context/        ← Auth state management
        ├── pages/          ← Full pages (Home, Submit, Dashboard...)
        ├── services/       ← Axios API setup
        └── App.jsx         ← Routes and app layout
```

---

## Getting Started

### What You Need First

- **Node.js** v20 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** account (free tier is fine)
- A **Cloudinary** account (for file uploads)

### 1. Clone the Project

```bash
git clone <your-repo-url>
cd IP
```

### 2. Set Up the Backend

```bash
cd chandabaz_backend
npm install
```

Now create a `.env` file in the `chandabaz_backend/` folder and fill it in:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=pick_a_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`.

### 3. Set Up the Frontend

Open a new terminal window:

```bash
cd chandabaz_frontend
npm install
```

Create a `.env` file in the `chandabaz_frontend/` folder:

```env
VITE_API_PROXY_TARGET=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`. The app is running!

---

## API Reference

All API routes start with `/api`.

### Auth Routes

| Method | Endpoint         | What It Does           | Who Can Use It  |
| ------ | ---------------- | ---------------------- | --------------- |
| `POST` | `/auth/register` | Create a new account   | Anyone          |
| `POST` | `/auth/login`    | Log in and get a token | Anyone          |
| `GET`  | `/auth/me`       | Get your own user info | Logged in users |

### Post Routes

| Method   | Endpoint     | What It Does                | Who Can Use It  |
| -------- | ------------ | --------------------------- | --------------- |
| `GET`    | `/posts`     | Browse all approved reports | Anyone          |
| `POST`   | `/posts`     | Submit a new report         | Logged in users |
| `GET`    | `/posts/:id` | View one report in detail   | Anyone          |
| `PUT`    | `/posts/:id` | Edit a rejected report      | Report owner    |
| `DELETE` | `/posts/:id` | Delete a report             | Owner or Admin  |
| `GET`    | `/posts/my`  | See all your own reports    | Logged in users |

### Comment Routes

| Method   | Endpoint            | What It Does              | Who Can Use It         |
| -------- | ------------------- | ------------------------- | ---------------------- |
| `GET`    | `/comments/:postId` | Read comments on a report | Anyone                 |
| `POST`   | `/comments/:postId` | Add a comment             | Logged in users        |
| `DELETE` | `/comments/:id`     | Delete a comment          | Comment owner or Admin |

### Admin Routes

| Method   | Endpoint                   | What It Does                  |
| -------- | -------------------------- | ----------------------------- |
| `GET`    | `/admin/stats`             | Platform statistics           |
| `GET`    | `/admin/posts`             | All reports (any status)      |
| `GET`    | `/admin/posts/pending`     | Reports waiting for review    |
| `PUT`    | `/admin/posts/:id/approve` | Approve a report              |
| `PUT`    | `/admin/posts/:id/reject`  | Reject a report with a reason |
| `DELETE` | `/admin/posts/:id`         | Force delete a report         |
| `GET`    | `/admin/users`             | List all users                |
| `PUT`    | `/admin/users/:id/toggle`  | Block or unblock a user       |

---

## How a Report Works (Step by Step)

```
User submits report
       ↓
Status: "Pending" (only the user can see it)
       ↓
Admin reviews the report
       ↓
   Approved? ──Yes──► Status: "Approved" → Public, gets Receipt ID
       |
      No
       ↓
   Status: "Rejected" (user gets a reason, can edit and resubmit)
```

---

## Pages

| Page             | URL          | What's On It                        |
| ---------------- | ------------ | ----------------------------------- |
| Home             | `/`          | Landing page, recent reports, stats |
| Login            | `/login`     | Sign in with email or phone         |
| Register         | `/register`  | Create a new account                |
| Submit           | `/submit`    | Submit a corruption report          |
| Post Detail      | `/post/:id`  | Full view of one report + comments  |
| Verified Reports | `/reports`   | All approved reports with filters   |
| Heatmap          | `/heatmap`   | Interactive map of incidents        |
| User Dashboard   | `/dashboard` | Your posts and their status         |
| Admin Dashboard  | `/admin`     | Admin controls (admin only)         |

---

## File Uploads

- Accepted file types: **JPEG, PNG, GIF, WebP, MP4, MOV, AVI, PDF**
- Max files per report: **5**
- Max file size: **50 MB each**
- Files are stored on **Cloudinary** in organized folders (`chandabaz/images`, `chandabaz/videos`, `chandabaz/documents`)

---

## Security Features

- **Passwords** are hashed with bcrypt (12 rounds) — never stored as plain text
- **JWT tokens** expire after 7 days
- **Rate limiting** — maximum 100 requests per 15 minutes
- **Helmet.js** adds secure HTTP headers automatically
- **Anonymous posts** — the author's name is removed before being sent to anyone
- **Admin routes** are protected — regular users can't access them

---

## Environment Variables Reference

### Backend (`.env`)

| Variable                | Required | Description                     |
| ----------------------- | -------- | ------------------------------- |
| `PORT`                  | No       | Server port (default: 5000)     |
| `MONGODB_URI`           | Yes      | MongoDB Atlas connection string |
| `JWT_SECRET`            | Yes      | Secret key for signing tokens   |
| `CLOUDINARY_CLOUD_NAME` | Yes      | Your Cloudinary cloud name      |
| `CLOUDINARY_API_KEY`    | Yes      | Cloudinary API key              |
| `CLOUDINARY_API_SECRET` | Yes      | Cloudinary API secret           |
| `CLIENT_URL`            | Yes      | Frontend URL for CORS           |

### Frontend (`.env`)

| Variable                | Required   | Description                       |
| ----------------------- | ---------- | --------------------------------- |
| `VITE_API_PROXY_TARGET` | Dev only   | Backend URL to proxy `/api` calls |
| `VITE_API_URL`          | Production | Full backend API URL              |

---

## Available Scripts

### Backend

```bash
npm run dev      # Start server with live reload (nodemon)
npm start        # Start server (production)
```

### Frontend

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build for production → /dist folder
npm run preview  # Preview the production build locally
```

---

## Deployment

The project is ready to deploy on these platforms:

- **Frontend:** Vercel (config in `vercel.json`) or Netlify (config in `public/_redirects`)
- **Backend:** Render, Railway, or any Node.js host

For production, set `VITE_API_URL` in the frontend to your live backend URL.

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "add: your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please test your changes before submitting a pull request.

---

#### I dedicate this project to `Allama Chanda Abbas` and `Derby Nasir`

---

_Built with care to make corruption harder to hide._
