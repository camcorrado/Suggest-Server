const express = require('express')
const sqlite3 = require('sqlite3')
const uuid = require('uuid')

const suggestionRouter = express.Router()

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

suggestionRouter.param('suggestionId', (req, res, next, suggestionId) => {
  const sql = 'SELECT * FROM Suggestion WHERE Suggestion.id = $suggestionId';
  const values = {$suggestionId: suggestionId};
  db.get(sql, values, (error, suggestion) => {
    if (error) {
      next(error)
    } else if (suggestion) {
      req.suggestion = suggestion
      next()
    } else {
      res.sendStatus(404)
    }
  })
})

suggestionRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Suggestion`, (err, suggestions) => {
    if (err) {
      next(err)
    } else {
      res.status(200).json({suggestions: suggestions})
    }
  })
})

suggestionRouter.get('/:suggestionId', (req, res, next) => {
  res.status(200).json({suggestion: req.suggestion})
})

suggestionRouter.post('/', (req, res, next) => {
  const id = uuid()
  const userId = 100
  const name = req.body.suggestion.name
  const content = req.body.suggestion.content
  const datePublished = req.body.suggestion.datePublished
  const dateModified = null
  const approved = false
  const dateApproved = null
  const upvotes = 0
  if (!name || !content) {
    return res.sendStatus(400)
  }

  const sql = 'INSERT INTO Suggestion (id, userId, name, content, date_published, date_modified, approved, date_approved, upvotes) VALUES ($id, $userId, $name, $content, $datePublished, $dateModified, $approved, $dateApproved, $upvotes)'
  const values = {
    $id: id, 
    $userId: userId,
    $name: name,
    $content: content,
    $datePublished: datePublished,
    $dateModified: dateModified,
    $approved: approved,
    $dateApproved: $dateApproved,
    $upvotes: upvotes
  }

  db.run(sql, values, function(error) {
    if (error) {
      next(error)
    } else {
      db.get(`SELECT * FROM Suggestiob WHERE Suggestion.id = ${this.lastID}`, (error, suggestion) => {
        res.status(201).json({suggestion: suggestion})
      })
    }
  })
})

suggestionRouter.put('/:suggestionId', (req, res, next) => {
  const id = uuid()
  const userId = 100
  const name = req.body.suggestion.name
  const content = req.body.suggestion.content
  const datePublished = req.body.suggestion.datePublished
  const dateModified = null
  const approved = false
  const dateApproved = null
  const upvotes = 0
  if (!name || !content) {
    return res.sendStatus(400)
  }

  const sql = `UPDATE Suggestion SET id = $id, userId = $userId, name = $name, content = $content, date_published = $datePublished, date_modified = $dateModified, approved = $approved date_approved = $dateApproved, upvotes = $upvotes WHERE Suggestion.id = $suggestionId`
  const values = {
    $id: id, 
    $userId: userId,
    $name: name,
    $content: content,
    $datePublished: datePublished,
    $dateModified: dateModified,
    $approved: approved,
    $dateApproved: $dateApproved,
    $upvotes: upvotes,
    $suggestionId: req.params.suggestionId
  }

  db.run(sql, values, function(error) {
    if (error) {
      next(error)
    } else {
       db.get(`SELECT * FROM Suggestion WHERE Suggestion.id = ${req.params.suggestionId}`, (error, suggestion) => {
        res.status(200).json({suggestion: suggestion});
      })
    }
  })
})

suggestionRouter.delete('/:suggestionId', (req, res, next) => {
  const sql = `DELETE FROM Suggestion WHERE Suggestion.id = $suggestionId`
  const values = {
    $suggestionId: req.params.suggestionId
  }

  db.run(sql, values, (error) => {
    if (error) {
      next(error)
    } else {
      db.get(`SELECT * FROM Suggestion WHERE Suggestion.id = ${req.params.suggestionId}`, (error, suggestion) => {
        res.status(200).json({suggestion: suggestion});
      })
    }
  })
})

module.exports = suggestionRouter