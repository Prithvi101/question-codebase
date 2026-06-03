from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(title="BeeCrypt Todo API")

# Mock database
TODO_DB = [
    {"id": 1, "title": "Learn FastAPI basics", "completed": True},
    {"id": 2, "title": "Set up assessment tests", "completed": False},
    {"id": 3, "title": "Review candidate submissions", "completed": False}
]

class TaskCreate(BaseModel):
    # BUG: Validation constraints are missing. It accepts empty or extremely long strings.
    title: str = Field(..., description="Task title")
    completed: Optional[bool] = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(completed: Optional[bool] = None):
    # BUG: Completely ignores the completed parameter and always returns all tasks.
    return TODO_DB

@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    # Custom validation checks to complement Pydantic
    # (Candidates might add validators, or clean whitespace)
    # If the title is empty after stripping, it should fail
    
    # Generate ID
    new_id = max([item["id"] for item in TODO_DB]) + 1 if TODO_DB else 1
    new_task = {
        "id": new_id,
        "title": task.title,
        "completed": task.completed if task.completed is not None else False
    }
    TODO_DB.append(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate):
    # Find task
    task = next((t for t in TODO_DB if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # BUG: Refers to non-existent index or mutates incorrectly.
    # It tries to access the DB as a dictionary with dict[task_id] but TODO_DB is a list of dicts.
    # This causes a TypeError: list indices must be integers or slices, not dict.
    TODO_DB[task_id]["title"] = task_data.title or TODO_DB[task_id]["title"]
    if task_data.completed is not None:
        TODO_DB[task_id]["completed"] = task_data.completed
        
    return TODO_DB[task_id]

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    # BUG: Throws a raw ValueError/KeyError if the item is missing instead of returning 404.
    # It looks for index of task to remove, which raises ValueError if not found.
    task_to_remove = next(t for t in TODO_DB if t["id"] == task_id)
    TODO_DB.remove(task_to_remove)
    return None
