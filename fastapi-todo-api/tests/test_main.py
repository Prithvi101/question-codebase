import pytest
from fastapi.testclient import TestClient
from app.main import app, TODO_DB

@pytest.fixture(autouse=True)
def reset_db():
    # Reset mock database before each test
    TODO_DB.clear()
    TODO_DB.extend([
        {"id": 1, "title": "Learn FastAPI basics", "completed": True},
        {"id": 2, "title": "Set up assessment tests", "completed": False},
        {"id": 3, "title": "Review candidate submissions", "completed": False}
    ])

client = TestClient(app)

def test_task_1_create_task_validation():
    # Blank title check
    response = client.post("/tasks", json={"title": "   ", "completed": False})
    assert response.status_code == 422

    # Empty title check
    response = client.post("/tasks", json={"title": "", "completed": False})
    assert response.status_code == 422

    # Too long title check (>100 characters)
    long_title = "a" * 101
    response = client.post("/tasks", json={"title": long_title, "completed": False})
    assert response.status_code == 422

    # Valid task creation should succeed
    response = client.post("/tasks", json={"title": "Valid task title", "completed": False})
    assert response.status_code == 201
    assert response.json()["title"] == "Valid task title"

def test_task_2_update_task():
    # Update title and completion state
    response = client.put("/tasks/2", json={"title": "Updated Title", "completed": True})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"
    assert response.json()["completed"] is True

    # Make sure task 2 actually updated in database
    get_res = client.get("/tasks")
    task_2 = next(t for t in get_res.json() if t["id"] == 2)
    assert task_2["title"] == "Updated Title"
    assert task_2["completed"] is True

def test_task_3_list_filter():
    # Filter for completed tasks
    response = client.get("/tasks?completed=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert all(t["completed"] is True for t in data)

    # Filter for uncompleted tasks
    response = client.get("/tasks?completed=false")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(t["completed"] is False for t in data)

    # Fetching without parameters should return all 3
    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 3

def test_task_4_delete_non_existent_task():
    # Delete non-existent task should return 404
    response = client.delete("/tasks/999")
    assert response.status_code == 404

    # Delete existing task should succeed (204)
    response = client.delete("/tasks/2")
    assert response.status_code == 204

    # Make sure it's gone
    get_res = client.get("/tasks")
    assert len(get_res.json()) == 2
    assert not any(t["id"] == 2 for t in get_res.json())
