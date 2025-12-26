# backend/add-task/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
import os

app = Flask(__name__)
CORS(app)

# 🔹 DB connection string from env (K8s secret)
DB_CONN_STRING = os.environ.get("DB_CONN_STRING")

if not DB_CONN_STRING:
    raise RuntimeError("DB_CONN_STRING env var not set")

engine = create_engine(
    DB_CONN_STRING,
    pool_pre_ping=True,
    echo=False,
)

Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


Base.metadata.create_all(engine)


# 🔹 HEALTH CHECK (two routes for AGIC + local test)
@app.route("/health", methods=["GET"])
@app.route("/api/add/health", methods=["GET"])   # 👈 NEW
def health():
    return jsonify({
        "status": "healthy",
        "service": os.environ.get("SERVICE_NAME", "tasks-add")
    }), 200


# 🔹 GET TASKS (optional, but keeps things consistent)
@app.route("/tasks", methods=["GET"])
@app.route("/api/add/tasks", methods=["GET"])   # 👈 NEW
def get_tasks():
    db = SessionLocal()
    try:
        tasks = db.query(Task).order_by(Task.created_at.desc()).all()
        result = [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in tasks
        ]
        return jsonify({"success": True, "tasks": result, "count": len(result)}), 200
    finally:
        db.close()


# 🔹 ADD TASK (POST endpoint)
@app.route("/tasks", methods=["POST"])
@app.route("/api/add/tasks", methods=["POST"])   # 👈 NEW
def add_task():
    payload = request.get_json() or {}
    title = payload.get("title")
    description = payload.get("description")

    if not title:
        return jsonify({"success": False, "error": "title required"}), 400

    db = SessionLocal()
    try:
        t = Task(title=title, description=description)
        db.add(t)
        db.commit()
        db.refresh(t)
        return jsonify({
            "success": True,
            "task": {
                "id": t.id,
                "title": t.title,
                "description": t.description,
            },
        }), 201
    finally:
        db.close()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=False,
    )
