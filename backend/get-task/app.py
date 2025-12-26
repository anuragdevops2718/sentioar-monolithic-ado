# backend/get-task/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
import os

app = Flask(__name__)
CORS(app)

# 🔹 READ DB CONNECTION STRING FROM ENV
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


# 🔹 HEALTH (frontend + AGIC ke liye)
@app.route("/health", methods=["GET"])
@app.route("/api/get/health", methods=["GET"])  # 👈 NEW
def health():
    return jsonify({
        "status": "healthy",
        "service": os.environ.get('SERVICE_NAME', 'tasks-get')
    }), 200


# 🔹 GET TASKS
@app.route("/tasks", methods=["GET"])
@app.route("/api/get/tasks", methods=["GET"])  # 👈 NEW
def get_tasks():
    db = SessionLocal()
    try:
        tasks = db.query(Task).order_by(Task.created_at.desc()).all()
        result = [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "created_at": t.created_at.isoformat() if t.created_at else None
            }
            for t in tasks
        ]
        return jsonify({"success": True, "tasks": result, "count": len(result)}), 200
    finally:
        db.close()


# 🔹 POST BLOCK WALA YAHAN SE HATA DIYA GA — GET service me ADD nahi aana chahiye


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
