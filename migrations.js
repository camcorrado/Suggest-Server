const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database.sqlite')

db.run(`CREATE TABLE IF NOT EXISTS Suggestion (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMP,
    date_modified TIMESTAMP,
    approved TEXT NOT NULL,
    date_approved TIMESTAMP DEFAULT 0,
    upvotes INTEGER NOT NULL
)`)