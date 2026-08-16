# CinePlux 🎬 — Premium Movie & Show Watchlist (Project No 8: Movie/ Show WatchList) 

CinePlux is a secure, responsive, full-stack Movie and TV Show Watchlist application built with Django REST Framework and React (Vite). The application enforces strict data isolation, secure authentication, and interactive ratings under a modern cyberpunk glassmorphism visual layout.  

---

## 📖 About The Project

CinePlux provides users with a private dashboard to track movies and TV shows they plan to watch or have already watched. Designed for speed, security, and aesthetics, it implements full JSON Web Token (JWT) refresh on the client and server, features instant client-side searching, and integrates user-scoped API data isolation.

---

## LIVE DEMO : https://cine-plux.vercel.app/  
Successfully deployed the Frontend on Vercel and Backend on Render

## 🛠️ Tech Stack

### Backend
- **Framework**: Django REST Framework (DRF)
- **Authentication**: `djangorestframework-simplejwt`
- **CORS Management**: `django-cors-headers`
- **Database**: SQLite (local development),PostgreSQL (production)
- **User System**: Django built-in `User` model with PBKDF2 password hashing

### Frontend
- **Framework**: React 18 (scaffolded via Vite)
- **HTTP Client**: Axios (configured with request and response interceptors)
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`)
- **Styling**: Modern, responsive vanilla CSS featuring glowing neon highlights and glassmorphic card overlays

---

## ✨ Key Features
- **User Authentication**: Secure user registration and login with JWT access and refresh tokens.
- **Dashboard Isolation**: Separate "To Watch" (Unwatched) and "Watched" tabbed sections.
- **Interactive Star Rating**: Select 1 to 5 stars on watched media items with hover effects and direct database persistence.
- **Complete CRUD**:
  - **Create**: Add a Movie or TV show (defaults to Unwatched).
  - **Read**: Fetch lists by status (Watched vs. Unwatched) with client-side searching.
  - **Update**: Edit title, type, watch status, and rating in a modal form.
  - **Delete**: Safely delete a media item with user confirmation.
- **Session Persistence**: Authentication state persists across page refreshes by reading tokens from local storage.
- **Data Isolation**: Multi-tenant data segregation. Users can never view or manipulate other users' watchlist data.

---

## 📂 Project Structure

```text
CinePlux/
├── backend/
│   ├── manage.py
│   ├── config/              # Django Settings & Global Routing
│   │   ├── settings.py
│   │   └── urls.py
│   ├── accounts/            # User Registration View & Serializers
│   │   ├── serializers.py
│   │   └── views.py
│   └── media_app/           # Watchlist Media Model, ViewSet, & Serializer
│       ├── models.py
│       ├── serializers.py
│       └── views.py
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css        # Visual styling system & glassmorphism
│   │   ├── api/
│   │   │   └── axios.js     # Axios client & JWT token refresh interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── MediaCard.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── AddMediaModal.jsx
│   │   │   └── EditMediaModal.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── Dashboard.jsx
├── requirements.txt         # Backend Python Dependencies
└── README.md                # Project Documentation
```

---

## 🔐 Authentication & Security Architecture

### JWT Token Flow
- **Login Endpoint (`/api/token/`)**: Receives username and password, returns:
  - `access` (Access Token, lifetime: 1 hour)
  - `refresh` (Refresh Token, lifetime: 1 day)
- **Refresh Endpoint (`/api/token/refresh/`)**: Receives refresh token and returns a new access token.

### Axios Interceptors
- **Request Interceptor**: Automatically attaches the access token as `Authorization: Bearer <token>` to all authenticated api requests. Individual components do not handle token formatting.
- **Response Interceptor (401 Handling)**:
  1. Catches `401 Unauthorized` responses (indicates access token expiration).
  2. Blocks the queue and automatically sends the refresh token to `/api/token/refresh/`.
  3. Saves the new access token and retries the original failed request.
  4. If the refresh token itself is invalid or expired, clears the local storage session, logs out, and redirects to `/login`.

### Owner-Scoped Security
- **Queryset Filtering**: The backend queryset on `MediaViewSet` is strictly filtered at the database query level:
  ```python
  def get_queryset(self):
      return Media.objects.filter(owner=self.request.user)
  ```
  This ensures that even if user A intercepts or guesses the ID of user B's media, the database returns a `404 Not Found` error.
- **Creation Guard**: The `owner` field is read-only and automatically assigned in `perform_create` using the authenticated request context:
  ```python
  def perform_create(self, serializer):
      serializer.save(owner=self.request.user)
  ```
  Users cannot pass a different owner ID via POST/PUT payloads.

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup

1. Navigate to the project root and create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
   - **macOS/Linux**: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```

5. Start the backend development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application UI will run on `http://localhost:5173/`.


---

## 🚀 Production Deployment

### Frontend (Vercel)
- React/Vite frontend is deployed on **Vercel** at `https://cine-plux.vercel.app`.
- The frontend Axios instance communicates with the backend URL configured during building (in `src/api/axios.js`).

### Backend (Render)
- Django backend is configured for deployment on **Render** (Web Service).
- **Database**: Supports persistent PostgreSQL. If Render PostgreSQL is attached, `DATABASE_URL` is automatically detected and used; otherwise, the app falls back to local SQLite.
- **Static Files**: Serves Django admin static assets cleanly using **WhiteNoise**.

#### Render Service Settings:
* **Build Command**:
  ```bash
  pip install -r requirements.txt && python backend/manage.py collectstatic --no-input && python backend/manage.py migrate
  ```
* **Start Command**:
  ```bash
  gunicorn --chdir backend config.wsgi:application
  ```

#### Required Render Environment Variables:
| Variable Name | Description | Example / Recommended Value |
|---|---|---|
| `DJANGO_SECRET_KEY` | Completely new production secret key. Do not reuse the development secret. | *[Generate a random secret]* |
| `DEBUG` | Disables debug mode in production. | `False` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated list of allowed hostnames (domain of your backend). | `your-backend.onrender.com` |
| `DATABASE_URL` | PostgreSQL connection URL. | *[Automatically populated when Render PostgreSQL is attached]* |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins. | `https://cine-plux.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated trusted origins for CSRF checks. | `https://cine-plux.vercel.app` |

---

## License

This project was developed as part of the IPlus Training program at Christ College of Engineering for academic purposes.


## 👤 Author

**G Varun**

*S3 CS-C*

*BTech CSE Student at Christ College of Engineering*
