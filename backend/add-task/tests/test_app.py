import os
import pytest

# Force in-memory DB before app import
os.environ["DB_CONN_STRING"] = "sqlite:///:memory:"
os.environ["SERVICE_NAME"] = "tasks-add-test"

from app import app, Base, engine, Task


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ===============================
# BASIC SANITY
# ===============================

def test_app_loaded():
    assert app is not None


# ===============================
# HEALTH CHECK
# ===============================

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "healthy"


# ===============================
# ADD TASK (POST)
# ===============================

def test_add_task_success(client):
    payload = {
        "title": "Learn Pytest",
        "description": "Add-task service test"
    }

    response = client.post("/tasks", json=payload)

    assert response.status_code == 201
    data = response.get_json()

    assert data["success"] is True
    assert data["task"]["title"] == "Learn Pytest"


# ===============================
# VALIDATION
# ===============================

def test_add_task_validation_error(client):
    payload = {
        "description": "Missing title"
    }

    response = client.post("/tasks", json=payload)

    assert response.status_code == 400
