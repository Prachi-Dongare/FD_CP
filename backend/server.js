const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// SQLite Connection - Creates 'database.sqlite' file in the backend folder
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite Connection Failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite Database (File-based)");
        initializeDatabase();
    }
});

// Initialize Database Table if it doesn't exist
function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'farmer',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error("❌ Users Table Failed:", err.message);
            else console.log("✅ Users table ready");
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS escalations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_email TEXT NOT NULL,
                farmer_name TEXT NOT NULL,
                query TEXT NOT NULL,
                answer TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error("❌ Escalations Table Failed:", err.message);
            else console.log("✅ Escalations table ready");
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                expert_name TEXT NOT NULL,
                expert_email TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                image_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error("❌ Blogs Table Failed:", err.message);
            else console.log("✅ Blogs table ready");
        });
    });
}

// Authentication Endpoints
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.run(sql, [name, email, password], function(err) {
        if (err) {
            console.error("Signup error:", err);
            return res.status(500).json({ message: "Email already exists or database error" });
        }
        res.json({ message: "User registered successfully", id: this.lastID });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Error during login" });
        }
        if (row) {
            res.json({ message: "Login successful", user: row });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

// Expert Escalation Endpoints
app.post("/escalate", (req, res) => {
    const { email, name, query } = req.body;
    console.log(`📩 [ESCALATE] New request from ${email} (${name}): ${query}`);
    
    if (!email || !query) {
        return res.status(400).json({ message: "Email and query are required" });
    }

    const sql = "INSERT INTO escalations (farmer_email, farmer_name, query, status) VALUES (?, ?, ?, 'pending')";
    db.run(sql, [email, name, query], function(err) {
        if (err) {
            console.error("❌ Escalation DB Error:", err);
            return res.status(500).json({ message: "Database error during escalation" });
        }
        console.log(`✅ Escalation saved with ID: ${this.lastID}`);
        res.json({ message: "Query escalated to experts", id: this.lastID });
    });
});

app.get("/escalations/pending", (req, res) => {
    const sql = "SELECT * FROM escalations WHERE status = 'pending' ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.post("/escalations/respond", (req, res) => {
    const { id, answer } = req.body;
    console.log(`📨 [RESPOND] Answering query ID: ${id}`);
    
    const sql = "UPDATE escalations SET answer = ?, status = 'answered' WHERE id = ?";
    db.run(sql, [answer, id], function(err) {
        if (err) {
            console.error("❌ Response DB Error:", err);
            return res.status(500).json({ message: err.message });
        }
        console.log(`✅ Query ${id} marked as answered`);
        res.json({ message: "Response sent to farmer" });
    });
});

app.get("/escalations/farmer/:email", (req, res) => {
    const { email } = req.params;
    const sql = "SELECT * FROM escalations WHERE farmer_email = ? ORDER BY created_at DESC";
    db.all(sql, [email], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// Debug Middleware for 404s
app.use((req, res, next) => {
    console.log(`🔍 404 Attempt: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route not found on this server" });
});

// Blog Endpoints
app.post("/blogs", (req, res) => {
    const { expert_name, expert_email, title, content, image_url } = req.body;
    const sql = "INSERT INTO blogs (expert_name, expert_email, title, content, image_url) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [expert_name, expert_email, title, content, image_url], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Blog posted successfully", id: this.lastID });
    });
});

app.get("/blogs", (req, res) => {
    const sql = "SELECT * FROM blogs ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
