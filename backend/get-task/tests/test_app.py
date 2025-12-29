import os
import pytest

# 🔹 Ensure test DB is used BEFORE app import
os.environ["DB_CONN_STRING"] = "sqlite:///:memory:"
os.environ["SERVICE_NAME"] = "tasks-get-test"

from app import app, Base, engine, Task


# 🔹 Pytest fixture for Flask test client
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


# 🔹 Setup & teardown in-memory DB for each test session
@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ===============================
# ✅ BASIC SANITY
# ===============================

def test_app_loaded():
    assert app is not None


# ===============================
# ✅ HEALTH CHECKS
# ===============================

def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    data = response.get_json()

    assert data["status"] == "healthy"
    assert data["service"] == "tasks-get-test"


def test_health_api_endpoint(client):
    response = client.get("/api/get/health")

    assert response.status_code == 200


# ===============================
# ✅ GET TASKS (EMPTY DB)
# ===============================

def test_get_tasks_empty(client):
    response = client.get("/tasks")

    assert response.status_code == 200
    data = response.get_json()

    assert data["success"] is True
    assert data["tasks"] == []
    assert data["count"] == 0


# ===============================
# ✅ GET TASKS (WITH DATA)
# ===============================

def test_get_tasks_with_data(client):
    # Insert test data directly using SQLAlchemy
    task = Task(
        title="Test Task",
        description="Testing GET endpoint"
    )

    from app import SessionLocal
    db = SessionLocal()
    db.add(task)
    db.commit()
    db.close()

    response = client.get("/tasks")

    assert response.status_code == 200
    data = response.get_json()

    assert data["success"] is True
    assert data["count"] == 1
    assert data["tasks"][0]["title"] == "Test Task"
