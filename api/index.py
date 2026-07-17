import os
import requests
import bcrypt
from datetime import datetime, timezone
from flask import Flask, render_template, jsonify, request, session, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from urllib.parse import urlparse

basedir = os.path.abspath(os.path.dirname(__file__))
project_root = os.path.dirname(basedir)

app = Flask(
    __name__,
    template_folder=os.path.join(project_root, "templates"),
    static_folder=os.path.join(project_root, "static"),
)

# Secret key must come from an environment variable in production.
# Set SECRET_KEY in Vercel's Project Settings -> Environment Variables.
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-insecure-key-change-me")

CORS(app)

# --- Database config -------------------------------------------------------
# Vercel's filesystem is read-only at deploy time and only /tmp is writable,
# and /tmp is wiped between cold starts. That means SQLite is fine for a demo
# or for read-mostly seed data, but any /api/news POST/DELETE done in
# production will NOT persist reliably. For real persistence, set a
# DATABASE_URL environment variable pointing at a hosted Postgres database
# (Vercel Postgres, Neon, Supabase all work) and this app will use it
# automatically instead of SQLite.
database_url = os.environ.get("DATABASE_URL")
if database_url:
    # Vercel Postgres / Neon sometimes hand out "postgres://"; SQLAlchemy
    # with psycopg needs "postgresql://".
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    db_path = "/tmp/cybersafe.db" if os.environ.get("VERCEL") else os.path.join(
        project_root, "cybersafe.db"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# News Model
class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.String(500), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


with app.app_context():
    db.create_all()


# Homepage
@app.route("/")
def home():
    return render_template("index.html")


# Admin password must come from an environment variable in production.
# Set ADMIN_PASSWORD in Vercel's Project Settings -> Environment Variables.
_admin_password = os.environ.get("ADMIN_PASSWORD", "CyberSafe@2026")
ADMIN_PASSWORD_HASH = bcrypt.hashpw(_admin_password.encode(), bcrypt.gensalt())


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        password = request.form.get("password", "")
        if bcrypt.checkpw(password.encode(), ADMIN_PASSWORD_HASH):
            session["admin"] = True
            return redirect("/admin")
        return render_template("login.html", error="Invalid password")

    return render_template("login.html")


@app.route("/admin")
def admin():
    if not session.get("admin"):
        return redirect("/login")
    return render_template("admin.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# API Route (Get All News)
@app.route("/api/news", methods=["GET"])
def cyber_news():
    news = News.query.order_by(News.created_at.desc()).all()
    result = []
    for item in news:
        result.append(
            {
                "id": item.id,
                "title": item.title,
                "summary": item.summary,
                "source": item.source,
                "category": item.category,
                "time": item.created_at.strftime("%d %b %Y | %I:%M %p"),
            }
        )
    return jsonify(result)


@app.route("/api/live-threats")
def live_threats():
    try:
        response = requests.get("https://openphish.com/feed.txt", timeout=10)
        phishing_urls = response.text.splitlines()[:20]
        threats = []

        for url in phishing_urls:
            domain = urlparse(url).netloc
            severity = "Medium"

            if any(
                keyword in url.lower()
                for keyword in [
                    "login",
                    "verify",
                    "bank",
                    "wallet",
                    "secure",
                    "account",
                ]
            ):
                severity = "Critical"
            elif any(
                keyword in url.lower()
                for keyword in ["crypto", "bonus", "gift", "reward"]
            ):
                severity = "High"

            threats.append(
                {"type": "Phishing", "severity": severity, "domain": domain, "url": url}
            )

        return jsonify(threats)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Add news
@app.route("/api/news", methods=["POST"])
def add_news():
    data = request.json
    title = data.get("title")
    summary = data.get("summary")
    source = data.get("source")
    category = data.get("category")

    if not title or not summary or not source or not category:
        return {"success": False, "message": "Missing required fields"}, 400

    new_news = News(title=title, summary=summary, source=source, category=category)
    db.session.add(new_news)
    db.session.commit()

    return {"success": True, "message": "News published successfully"}


# Delete news
@app.route("/api/news/<int:id>", methods=["DELETE"])
def delete_news(id):
    news = News.query.get(id)
    if not news:
        return {"success": False, "message": "News not found"}, 404

    db.session.delete(news)
    db.session.commit()

    return {"success": True, "message": "News deleted successfully"}


if __name__ == "__main__":
    app.run(debug=True)
