const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('pacman'));

// Database Setup
const db = new sqlite3.Database('./scores.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the high scores database.');
});

db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    score INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API Routes
app.post('/api/scores', (req, { body }, res) => {
    const { username, score } = body;
    db.run(`INSERT INTO scores (username, score) VALUES (?, ?)`, [username, score], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/scores', (req, res) => {
    db.all(`SELECT * FROM scores ORDER BY score DESC LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
