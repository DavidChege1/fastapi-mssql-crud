from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import urllib.parse

# Using Windows Authentication (Trusted_Connection=yes)
server = r"JAMES"
database = "FastAPITestDB"
driver = "ODBC Driver 17 for SQL Server"

# pyodbc requires the driver name exactly as it appears in ODBC Data Source Administrator
driver_str = f"{{{driver}}}"
params = urllib.parse.quote_plus(
    f"DRIVER={driver_str};SERVER={server};DATABASE={database};Trusted_Connection=yes;"
)

SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# connect_args={'check_same_thread': False} is not needed for MS SQL Server
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
