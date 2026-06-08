from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------------------------------------------
# SECURITY — change SECRET_KEY in production, set DEBUG=False
# ----------------------------------------------------------------
SECRET_KEY = 'change-me-in-production'
DEBUG = True
ALLOWED_HOSTS = ['*']

# ----------------------------------------------------------------
# APPS
# ----------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    # Local apps
    'accounts.apps.AccountsConfig',
    'tasks.apps.TasksConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
AUTH_USER_MODEL = 'accounts.User'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]

# ----------------------------------------------------------------
# DATABASE — update USER, PASSWORD with your MySQL credentials
# ----------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'rbac_db',
        'USER': 'root',
        'PASSWORD': 'Msa6379898@',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# ----------------------------------------------------------------
# JWT — access token: 60 min | refresh token: 7 days
# ----------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,       # new refresh token on every refresh
    'BLACKLIST_AFTER_ROTATION': True,    # old refresh token is blacklisted
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ----------------------------------------------------------------
# REST FRAMEWORK
# ----------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    # API versioning — all routes are under /api/v1/
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'ALLOWED_VERSIONS': ['v1'],
    'DEFAULT_VERSION': 'v1',
    # Filtering, search, ordering available on all list endpoints
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'api.pagination.StandardPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'api.exceptions.custom_exception_handler',
}

# ----------------------------------------------------------------
# API DOCS (Swagger) — visit http://localhost:8000/api/docs/
# ----------------------------------------------------------------
SPECTACULAR_SETTINGS = {
    'TITLE': 'Scalable REST API with RBAC',
    'DESCRIPTION': (
        'JWT-authenticated REST API with Role-Based Access Control.\n\n'
        '**How to use:**\n'
        '1. Register a user via POST /api/v1/auth/register/\n'
        '2. Login via POST /api/v1/auth/login/ — copy the `access` token\n'
        '3. Click Authorize 🔒 above and enter: Bearer <your_token>\n'
        '4. Now all endpoints are accessible based on your role'
    ),
    'VERSION': 'v1',
    'SERVE_INCLUDE_SCHEMA': False,
}

# ----------------------------------------------------------------
# CORS — allowed frontend origins
# ----------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',   # Vite dev server
    'http://localhost:3000',   # React dev server
]
CORS_ALLOW_CREDENTIALS = True

# ----------------------------------------------------------------
# PASSWORD VALIDATION
# ----------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ----------------------------------------------------------------
# MISC
# ----------------------------------------------------------------
STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
