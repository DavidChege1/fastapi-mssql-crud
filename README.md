# FastAPI MS SQL Server CRUD Practice

A simple FastAPI application demonstrating CRUD (Create, Read, Update, Delete) operations with Microsoft SQL Server using SQLAlchemy and Pydantic.

## Features
- **Item Management**: Full CRUD operations for items.
- **Employee Management**: Full CRUD operations for employees.
- **Auto Table Creation**: Tables are automatically created upon startup if they don't exist.
- **Interactive API Docs**: Built-in Swagger UI and Redoc.
- **HR Dashboard**: A basic frontend UI accessible at `/hr`.

## Prerequisites
- **Python**: 3.8+
- **Microsoft SQL Server**: A running instance (e.g., SSMS).
- **ODBC Driver**: [ODBC Driver 17 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) installed on your machine.

## Getting Started

### 1. Clone the repository
```bash
# In your terminal
cd "Testing FastApi with Antigravity"
```

### 2. Set up Virtual Environment
```bash
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Configuration
Open `database.py` and update the server name:
```python
server = r"YOUR_SERVER_NAME" # Default is JAMES
database = "FastAPITestDB"
```
Ensure your SQL Server is configured to allow Windows Authentication or update the connection string accordingly.

### 5. Run the Application
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## API Endpoints
- **Root**: `GET /`
- **HR Dashboard**: `GET /hr`
- **Interactive Docs**: `GET /docs` (Swagger UI)
- **Employees**: `GET /employees`, `POST /employees/`, etc.
- **Items**: `GET /items`, `POST /items/`, etc.

## Project Structure
- `main.py`: Entry point and API routes.
- `models.py`: SQLAlchemy database models.
- `schemas.py`: Pydantic models for data validation.
- `crud.py`: Database interaction logic.
- `database.py`: Database connection setup.
- `static/`: Static files (HTML, CSS, JS).
- `.gitignore`: Files to be ignored by Git.
