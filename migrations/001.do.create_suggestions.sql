CREATE TABLE suggestions (
    id INTEGER PRIMARY KEY,
    userid INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published DATE DEFAULT now() NOT NULL,
    date_modified DATE,
    approved BOOLEAN NOT NULL,
    date_approved DATE,
    upvotes INTEGER NOT NULL
);