import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_NAME = "database.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            motto TEXT DEFAULT ''
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return "Backend is running!"


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409

    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, password)
    )
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Registration successful"
    }), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    name = data.get("name", "").strip()
    password = data.get("password", "").strip()

    if not name or not password:
        return jsonify({
            "success": False,
            "message": "Name and password are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE name = ? AND password = ?",
        (name, password)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "motto": user["motto"]
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Try again"
    }), 401


if __name__ == "__main__":
    init_db()
    app.run(debug=True)