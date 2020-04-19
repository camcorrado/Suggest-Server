const knex = require('knex')
const app = require('../src/app')
const makeSuggestionsArray = require('./suggestions.fixutes')

describe('Suggestions Endpoints', function() {
  let db

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)

  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('suggestions').truncate())

  afterEach('cleanup',() => db.raw('TRUNCATE suggestions RESTART IDENTITY CASCADE'))

  describe(`GET /api/suggestions`, () => {
    context(`Given no suggestions`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/suggestions')
          .expect(200, [])
      })
    })

    context('Given there are suggestions in the database', () => {
      const testSuggestions = makeSuggestionsArray();

      beforeEach('insert suggestions', () => {
        return db
          .into('suggestions')
          .insert(testSuggestions)
      })

      it('responds with 200 and all of the suggestions', () => {
        return supertest(app)
          .get('/api/suggestions')
          .expect(200, testSuggestions)
      })
    })
  })

  describe(`GET /api/suggestions/:suggestionId`, () => {
    context(`Given no suggestions`, () => {
      it(`responds with 404`, () => {
        const suggestionId = 123456
        return supertest(app)
          .get(`/api/suggestions/${suggestionId}`)
          .expect(404, { error: { message: `Suggestion doesn't exist` } })
      })
    })

    context('Given there are suggestions in the database', () => {
      const testSuggestions = makeSuggestionsArray()

      beforeEach('insert suggestions', () => {
        return db
          .into('suggestions')
          .insert(testSuggestions)
      })

      it('responds with 200 and the specified suggestion', () => {
        const suggestionId = 2
        const expectedSuggestion = testSuggestions[suggestionId - 1]
        return supertest(app)
          .get(`/api/suggestions/${suggestionId}`)
          .expect(200, expectedSuggestion)
      })
    })
  })

  describe(`POST /api/suggestions`, () => {
    it(`creates a suggestion, responding with 201 and the new suggestion`, () => {
      const newSuggestion = {
        userid: 1234567,
        title: 'Test new suggestion title',
        content: 'Test new suggestion content',
        date_published: 'Fri Jan 03 2020',
        approved: true,
        upvotes: 1234567
      }
      return supertest(app)
        .post('/api/suggestions')
        .send(newSuggestion)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.userid).to.eql(newSuggestion.userid)
          expect(res.body.title).to.eql(newSuggestion.title)
          expect(res.body.content).to.eql(newSuggestion.content)
          expect(res.body.date_published).to.eql(newSuggestion.date_published)
          expect(res.body.approved).to.eql(newSuggestion.approved)
          expect(res.body.upvotes).to.eql(newSuggestion.upvotes)
          expect(res.headers.location).to.eql(`/api/suggestions/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/suggestions/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['userid', 'title', 'content', 'date_published', 'approved', 'upvotes']

    requiredFields.forEach(field => {
      const newSuggestion = {
        userid: 1234567,
        title: 'Test new suggestion title',
        content: 'Test new suggestion content',
        date_published: 'Fri Jan 03 2020',
        approved: false,
        upvotes: 1234567
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSuggestion[field]

        return supertest(app)
          .post('/api/suggestions')
          .send(newSuggestion)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe(`DELETE /api/suggestions/:suggestionId`, () => {
    context(`Given no suggestions`, () => {
      it(`responds with 404`, () => {
        const suggestionId = 123456
        return supertest(app)
          .delete(`/api/suggestions/${suggestionId}`)
          .expect(404, { error: { message: `Suggestion doesn't exist` } })
      })
    })

    context('Given there are suggestions in the database', () => {
      const testSuggestions = makeSuggestionsArray()

      beforeEach('insert suggestions', () => {
        return db
          .into('suggestions')
          .insert(testSuggestions)
      })

      it('responds with 204 and removes the suggestion', () => {
        const idToRemove = 2
        const expectedSuggestion = testSuggestions.filter(suggestion => suggestion.id !== idToRemove)
        return supertest(app)
          .delete(`/api/suggestions/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/suggestions`)
              .expect(expectedSuggestion)
          )
      })
    })
  })

  describe(`PATCH /api/suggestions/:suggestionId`, () => {
    context(`Given no suggestions`, () => {
      it(`responds with 404`, () => {
        const suggestionId = 123456
        return supertest(app)
          .delete(`/api/suggestions/${suggestionId}`)
          .expect(404, { error: { message: `Suggestion doesn't exist` } })
      })
    })

    context('Given there are suggestions in the database', () => {
      const testSuggestions = makeSuggestionsArray()

      beforeEach('insert suggestions', () => {
        return db
          .into('suggestions')
          .insert(testSuggestions)
      })

      it('responds with 204 and updates the suggestion', () => {
        const idToUpdate = 2
        const updateSuggestion = {
          title: 'updated suggestion title',
          content: 'updated suggestion content',
        }
        const expectedSuggestion = {
          ...testSuggestions[idToUpdate - 1],
          ...updateSuggestion
        }
        return supertest(app)
          .patch(`/api/suggestions/${idToUpdate}`)
          .send(updateSuggestion)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/suggestions/${idToUpdate}`)
              .expect(expectedSuggestion)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/suggestions/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: "Request body must contain either 'id', 'userid', 'title', 'content', 'date_published', 'date_modified', 'approved', 'date_approved', 'upvotes'"
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateSuggestion = {
          title: 'updated suggestion title',
        }
        const expectedSuggestion = {
          ...testSuggestions[idToUpdate - 1],
          ...updateSuggestion
        }

        return supertest(app)
          .patch(`/api/suggestions/${idToUpdate}`)
          .send({
            ...updateSuggestion,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/suggestions/${idToUpdate}`)
              .expect(expectedSuggestion)
          )
      })
    })
  })
})