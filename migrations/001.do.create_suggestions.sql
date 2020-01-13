CREATE TABLE Suggestion (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP DEFAULT now(),
    approved TEXT NOT NULL,
    date_approved TIMESTAMP DEFAULT now(),
    upvotes INTEGER NOT NULL
);