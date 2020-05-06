const moment = require('moment')
const path = require('path')
const express = require('express')
const SuggestionsService = require('./suggestions-server')

const suggestionsRouter = express.Router()
const jsonParser = express.json()

const serializeSuggestion = suggestion => ({
    id: suggestion.id,
    userid: suggestion.userid,
    title: suggestion.title,
    content: suggestion.content,
    date_published: moment(suggestion.date_published).format('ddd MMM DD YYYY'),
    date_modified: suggestion.date_modified === null ? null : moment(suggestion.date_modified).format('ddd MMM DD YYYY'),
    approved: suggestion.approved,
    date_approved: suggestion.date_approved === null ? null : moment(suggestion.date_approved).format('ddd MMM DD YYYY'),
    upvotes: suggestion.upvotes
})

suggestionsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        SuggestionsService.getAllSuggestions(knexInstance)
            .then(suggestions => {
                res.json(suggestions.map(serializeSuggestion))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { userid, title, content, date_published, approved, upvotes } = req.body
        const newSuggestion = { userid, title, content, date_published, approved, upvotes }

        for (const [key, value] of Object.entries(newSuggestion))
        if (value == null)
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })

        SuggestionsService.insertSuggestion(
            req.app.get('db'),
            newSuggestion
        )
            .then(suggestion => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${suggestion.id}`))
                    .json(serializeSuggestion(suggestion))
            })
        .catch(next)
  })

suggestionsRouter
    .route('/:suggestionId')
    .all((req, res, next) => {
        SuggestionsService.getById(
            req.app.get('db'),
            req.params.suggestionId
        )
            .then(suggestion => {
                if (!suggestion) {
                    return res.status(404).json({
                        error: { message: `Suggestion doesn't exist` }
                    })
                }
                res.suggestion = suggestion
                next()
            })
            .catch(next)
            })
    .get((req, res, next) => {
        res.json(serializeSuggestion(res.suggestion))
    })
    .delete((req, res, next) => {
        SuggestionsService.deleteSuggestion(
            req.app.get('db'),
            req.params.suggestionId
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { id, userid, title, content, date_published, date_modified, approved, date_approved, upvotes } = req.body
        const suggestionToUpdate = { id, userid, title, content, date_published, date_modified, approved, date_approved, upvotes }

        const numberOfValues = Object.values(suggestionToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'id', 'userid', 'title', 'content', 'date_published', 'date_modified', 'approved', 'date_approved', 'upvotes'`
                }
            })

        SuggestionsService.updateSuggestion(
            req.app.get('db'),
            req.params.suggestionId,
            suggestionToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
  })

module.exports = suggestionsRouter