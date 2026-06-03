# FastAPI Todo API Assessment

Welcome to the FastAPI Todo API assessment!

This is a Python backend assessment using FastAPI. The code has validation bugs, endpoint crashes, and missing filtering logic.

## Setup Instructions

1. Create a virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

3. Run tests:
   ```bash
   pytest
   ```

## Tasks

1. **Fix Task Title Input Validation:** Pydantic is configured but doesn't properly reject titles that are blank strings or longer than 100 characters. Fix the title field constraints on the `TaskCreate` schema to return `422 Unprocessable Entity` for invalid values.
2. **Fix Status Update Handler:** The PUT `/tasks/{task_id}` endpoint fails to correctly toggle/update task status or properties because it mutates the local mock DB incorrectly. Solve this update logic.
3. **Implement Completed Filter:** Update `GET /tasks` to support an optional `completed` boolean query parameter.
4. **Fix Deleting Non-Existent Tasks Error Response:** `DELETE /tasks/{task_id}` currently throws an exception if the `task_id` is missing from the mock database, leading to a 500 error. Catch this case and return a proper `404 Not Found` response.
