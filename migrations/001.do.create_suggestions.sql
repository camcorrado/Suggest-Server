CREATE TABLE suggestions (
    id INTEGER PRIMARY KEY,
    userid INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP DEFAULT null,
    approved BOOLEAN NOT NULL,
    date_approved TIMESTAMP DEFAULT null,
    upvotes INTEGER NOT NULL
);