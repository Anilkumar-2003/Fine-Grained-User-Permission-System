# Fine-Grained Employee Permission Management System

A full-stack employee management system that implements a fine-grained user-to-permission access control model.  
The system allows administrators to create employees, assign permissions, and control access to APIs using JWT authentication.

The backend is built with Django REST Framework and PostgreSQL, while the frontend is built with React and Material UI.  
The system enforces permission-based access control to ensure that only authorized users can perform specific actions.


# Technology Stack

# Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- SimpleJWT (Authentication)
- drf_yasg (Swagger API Documentation)

# Frontend
- React
- Material UI
- Axios
- Recharts
- React Router


# Project Features

- JWT based authentication
- Employee management (Create, Update, Delete, List)
- Fine-grained permission assignment
- Permission based API access control
- Dashboard summary and analytics
- Pagination, searching, sorting, and filtering
- User profile and permission visibility
- Swagger API documentation
- Secure API communication with token-based authorization

# System Overview

The application consists of two main components:

# Backend API
Responsible for authentication, business logic, permission management, and database operations.

# Frontend Application
Provides a user interface for administrators to manage employees, assign permissions, and view system analytics.

The frontend communicates with the backend via REST APIs secured with JWT tokens.


# Backend Setup Instructions

# Clone Repository

git clone https://github.com/your-username/permission-project-backend.git

cd permission-project-backend

Create Virtual Environment -- python -m venv venv

Activate virtual environment -- venv\Scripts\activate

# Install Dependencies

pip install -r requirements.txt

# Create Environment File

Create a `.env` file in the project root directory.

# Run Database Migrations

python manage.py makemigrations
python manage.py migrate

# Start Development Server

python manage.py runserver

Backend will run at http://127.0.0.1:8000

Swagger documentation at http://127.0.0.1:8000/swagger/

# Frontend Setup Instructions

# Clone Repository
git clone https://github.com/your-repo/frontend.git

cd frontend

# Install Dependencies

npm install

# Create Environment File

Create a `.env` file in the project root directory.

# Run Development Server -- npm run dev

Frontend will run at http://localhost:5173

# Environment Variables

# Backend `.env`

SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=admin
DB_USER=postgres
DB_PASSWORD=postgress
DB_HOST=localhost
DB_PORT=5432

ACCESS_TOKEN_MINUTES=90
REFRESH_TOKEN_DAYS=1


## Frontend `.env`


VITE_API_BASE_URL=http://localhost:8000

VITE_APP_NAME=Fine-Grained User Permission System
VITE_APP_ENV=development


# Database Structure
The system manages employees and permissions using four main tables.

# Users Table (auth_user)
Stores user authentication information.
Columns

- id
- username
- email
- password
- is_active
- date_joined

Relationship
- One user has one employee profile
- One user can have multiple permissions
# Employee Table (accounts_employee)
Stores employee related information linked to the user account.
Columns
- emp_id
- user_id (Foreign Key)
- department
- designation
- created_at

Relationship - One employee belongs to one user

# Permission Table (accounts_permission)
Stores the list of available permissions.

Columns

- id
- name
- code
- description

# User Permission Mapping Table (accounts_userpermissionmapping)
Manages the mapping between users and permissions.

Columns
- id
- user_id (Foreign Key)
- permission_id (Foreign Key)

Relationship
- A user can have multiple permissions
- A permission can belong to multiple users

# Seed Instructions

After migrations, initialize the system with default data.

Create Superuser -- python manage.py createsuperuser

# Login to Admin Panel
http://127.0.0.1:8000/admin

# Create Default Permissions
Add the following permission codes:
VIEW_EMPLOYEE
CREATE_EMPLOYEE
EDIT_EMPLOYEE
DELETE_EMPLOYEE
ASSIGN_PERMISSION
VIEW_SELF

# Sample Credentials

Admin user
Email: admin@gmail.com

Password: admin1234567

# API Overview

# Authentication
POST /api/login/

# Employee APIs
GET /api/accounts_employee/getAll?page=0&size=5&sortBy=id&sortOrder=DESC
POST /api/employees/create/
PUT /api/employees/{emp_id}/update/
DELETE /api/employees/{emp_id}/delete/

# Permission APIs
GET /api/permissions/
POST /api/assign-permissions/

# User APIs
GET /api/getdetails/?email=user@email.com

GET /api/my-permissions/?user_id={id}

# Dashboard APIs

GET /api/summary/

# Authorization

All protected APIs require a valid JWT access token.

Header format
Authorization: Bearer <access_token>

API access is controlled using permission codes assigned to users.

Permission access rules
- VIEW_EMPLOYEE → View employee list
- CREATE_EMPLOYEE → Create employees
- EDIT_EMPLOYEE → Update employees
- DELETE_EMPLOYEE → Delete employees
- ASSIGN_PERMISSION → Assign permissions to users
- VIEW_SELF → View own profile details

# Frontend Application Features
- User login with JWT authentication
- Employee management interface
- Create, edit, and delete employees
- Assign permissions to users
- Dashboard with employee statistics
- Charts for permission distribution
- User profile and permission visibility
- Permission based UI access control

# Development Summary
- JWT tokens are stored in browser local storage.
- Axios interceptors automatically attach authorization headers.
- Unauthorized API responses redirect users to the login page.
- All protected routes require valid authentication and permission checks.
