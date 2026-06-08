# Scalable REST API with RBAC

A full-stack web application with JWT authentication, Role-Based Access Control (RBAC), and task management. Built with Django REST Framework and React.js.

---

## Live URLs (Local)

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | React Frontend |
| `http://127.0.0.1:8000/admin/` | Django Admin Panel |
| `http://127.0.0.1:8000/api/docs/` | Swagger API Docs |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Django, Django REST Framework |
| Frontend | React.js, Vite |
| Database | MySQL |
| Authentication | JWT (JSON Web Token) |
| API Docs | Swagger UI (drf-spectacular) |
| Admin Panel | Django Admin |

---

## Features

- ✅ User registration & login with password hashing
- ✅ JWT authentication (access + refresh tokens)
- ✅ Token blacklisting on logout
- ✅ Role-Based Access Control (admin / user)
- ✅ Full CRUD for tasks
- ✅ Filter, search & order tasks
- ✅ API versioning (`/api/v1/`)
- ✅ Consistent error handling & validation
- ✅ Pagination (10 items per page)
- ✅ Swagger API documentation
- ✅ Django Admin panel
- ✅ MySQL database
- ✅ CORS protection
- ✅ Input sanitization

---

## Project Structure

```
scalable-rest-api-rbac/
│
├── backend/
│   ├── accounts/            # User auth, roles, permissions
│   │   ├── models.py        # User model with role field
│   │   ├── serializers.py   # Register & user serializers
│   │   ├── views.py         # Register, login, logout, profile
│   │   ├── permissions.py   # IsAdmin, IsOwnerOrAdmin
│   │   ├── urls.py          # Auth routes
│   │   └── admin.py         # Admin panel config
│   │
│   ├── tasks/               # Task management
│   │   ├── models.py        # Task model
│   │   ├── serializers.py   # Task serializer with validation
│   │   ├── views.py         # Task CRUD ViewSet
│   │   ├── filters.py       # Filter by status, priority
│   │   ├── urls.py          # Task routes
│   │   └── admin.py         # Admin panel config
│   │
│   ├── api/                 # Shared utilities
│   │   ├── pagination.py    # Standard pagination
│   │   └── exceptions.py    # Custom error handler
│   │
│   ├── config/              # Django settings
│   │   ├── settings.py      # App configuration
│   │   └── urls.py          # Root URL config
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── TasksPage.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
│
├── schema.sql                         # MySQL database schema
├── RBAC_API.postman_collection.json   # Postman collection
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/scalable-rest-api-rbac.git
cd scalable-rest-api-rbac
```

---

### 2. Setup MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE rbac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Update your MySQL credentials in `config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'rbac_db',
        'USER': 'root',
        'PASSWORD': 'your_mysql_password',  # change this
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

Run migrations:

```bash
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

Set the admin role:

```bash
python manage.py shell
```

```python
from accounts.models import User
User.objects.filter(username='your_username').update(role='admin')
exit()
```

Start the backend:

```bash
python manage.py runserver
```

---

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register/` | Public | Register new user |
| POST | `/api/v1/auth/login/` | Public | Login, get JWT tokens |
| POST | `/api/v1/auth/logout/` | Auth | Logout, blacklist token |
| POST | `/api/v1/auth/token/refresh/` | Public | Refresh access token |
| GET/PATCH | `/api/v1/auth/profile/` | Auth | View or update profile |
| GET | `/api/v1/auth/users/` | Admin | List all users |

### Tasks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks/` | Auth | List all tasks |
| POST | `/api/v1/tasks/` | Admin | Create a task |
| GET | `/api/v1/tasks/{id}/` | Auth | Get task by ID |
| PATCH | `/api/v1/tasks/{id}/` | Admin | Update a task |
| DELETE | `/api/v1/tasks/{id}/` | Admin | Delete a task |

### Task Filters

```
?status=todo | in_progress | done
?priority=low | medium | high
?search=keyword
?ordering=-created_at
?page=1&page_size=10
```

---

## Roles & Permissions

| Feature | User | Admin |
|---------|------|-------|
| Register & Login | ✅ | ✅ |
| View tasks | ✅ | ✅ |
| View own profile | ✅ | ✅ |
| Create task | ❌ | ✅ |
| Edit task | ❌ | ✅ |
| Delete task | ❌ | ✅ |
| View all users | ❌ | ✅ |
| Access admin panel | ❌ | ✅ |

---

## Security

| Feature | Implementation |
|---------|---------------|
| Password hashing | Django PBKDF2 |
| JWT blacklisting | Logout invalidates token |
| Password rules | Min 8 chars, not common, not all numbers |
| CORS | Only localhost:5173 and localhost:3000 |
| Role enforcement | Every endpoint checks role |
| Input validation | All fields validated on backend |

---

## Environment Variables

For production, move sensitive values to a `.env` file:

```env
SECRET_KEY=your-secret-key
DB_NAME=rbac_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306
DEBUG=False
```

---

## Postman Collection

Import `RBAC_API.postman_collection.json` into Postman.

The **Login** request automatically saves the `access_token` and `refresh_token` as collection variables for use in all other requests.

---

## Database Schema

See `schema.sql` for the full MySQL schema.

Main tables:

| Table | Description |
|-------|-------------|
| `accounts_user` | Users with roles |
| `tasks_task` | Tasks with status and priority |
| `token_blacklist_outstandingtoken` | Issued JWT tokens |
| `token_blacklist_blacklistedtoken` | Blacklisted tokens after logout |

---

## Screenshots

> Frontend — Login Page

![Login](https://via.placeholder.com/800x400?text=Login+Page)

> Frontend — Task Dashboard

![Dashboard](https://via.placeholder.com/800x400?text=Task+Dashboard)

> Swagger API Docs

![Swagger](https://via.placeholder.com/800x400?text=Swagger+Docs)

---

## License

MIT License — free to use and modify.

---

## Author

Built with Django REST Framework + React.js
