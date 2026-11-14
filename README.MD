# 🔗 LinkShort – URL Shortener & QR Code Generator

A modern, full-stack URL shortener SaaS application that allows users to create short URLs, generate QR codes, and track link performance through analytics.

LinkShort provides a simple and efficient way to manage links with secure authentication, fast redirection, and link tracking.

## 🚀 Features

- **URL Shortening:** Convert long URLs into short, shareable links.
- **QR Code Generator:** Generate QR codes for URLs.
- **Link Analytics:** Track clicks and monitor link performance.
- **User Authentication:** Secure email and password authentication.
- **Social Login:** Sign in using Google and Facebook.
- **My Links:** Manage, view, and organize shortened URLs.
- **Fast Redirection:** Redis caching for efficient URL redirection.
- **Rate Limiting:** Protect API endpoints against excessive requests.
- **Secure Authentication:** JWT-based access and refresh token authentication.
- **Responsive UI:** Clean interface for desktop and mobile devices.
- **Toast Notifications:** Interactive success and error notifications.

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Redis
- JWT Authentication
- Cookie Parser

### Authentication & Security
- Google OAuth 2.0
- Facebook OAuth
- Access and Refresh Tokens
- HTTP-only Cookies
- API Rate Limiting

### Tools
- Git & GitHub
- VS Code
- Vercel

## 📁 Project Structure

```text
LinkShort/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── index.ts
│   └── package.json
│
└── README.md
```

*The structure above is illustrative; adjust it to match your actual repository.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd LinkShort
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=your_postgresql_connection_string
REDIS_URL=your_redis_connection_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

Start the backend development server:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open your browser:

```text
http://localhost:5173
```

## 🔐 Environment Variables

Configure the following environment variables before running the application:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `REDIS_URL` | Redis connection URL |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `FRONTEND_URL` | Frontend application URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FACEBOOK_APP_ID` | Facebook application ID |
| `FACEBOOK_APP_SECRET` | Facebook application secret |
| `VITE_API_URL` | Backend API URL for frontend |

**Security:** Never commit `.env` files or expose secret keys in frontend code.

## 📌 Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/shorturl` | Create short URLs |
| `/analysis` | Link analytics |
| `/mylinks` | Manage shortened links |
| `/qrcodes` | Generate QR codes |
| `/login` | User login |
| `/register` | User registration |

## 🔄 How It Works

1. User registers or logs into LinkShort.
2. User enters a long URL.
3. Backend generates a unique short code.
4. The shortened URL is stored in PostgreSQL.
5. Redis caches URL mappings for faster lookups.
6. When someone visits the short URL, the backend retrieves the original URL and redirects the visitor.
7. Click events are recorded for analytics.

## 🚀 Deployment

The application can be deployed using:

- **Frontend:** Vercel
- **Backend:** Vercel
- **Database:** Managed PostgreSQL
- **Caching:** Managed Redis

Configure production environment variables and OAuth callback URLs before deployment.

## 🔮 Future Improvements

- Custom short URLs.
- Link expiration settings.
- Advanced analytics dashboard.
- Geographic click analytics.
- Bulk URL shortening.
- Link password protection.

## 👨‍💻 Author

**Saurabh Singh**

- GitHub: [saurabh-singh-07](https://github.com/saurabh-singh-07)
- LinkedIn: [Saurabh Singh](https://www.linkedin.com/in/saurabh-singh-577a83341/)

---

⭐ If you find this project useful, consider giving it a star!

**Built with ❤️ using React, TypeScript, Node.js, PostgreSQL, and Redis.**