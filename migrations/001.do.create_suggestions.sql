CREATE TABLE Suggestion (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMP,
    date_modified TIMESTAMP,
    approved TEXT NOT NULL,
    date_approved TIMESTAMP DEFAULT 0,
    upvotes INTEGER NOT NULL
);