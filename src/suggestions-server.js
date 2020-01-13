  
const SuggestionsService = {
    getAllSuggestions(knex) {
      return knex.select('*').from('Suggestion')
    },
    insertSuggestions(knex, newSuggestion) {
      return knex
        .insert(newSuggestion)
        .into('Suggestion')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('Suggestion').select('*').where('id', id).first()
    },
    deleteSuggestion(knex, id) {
      return knex('Suggestion')
        .where({ id })
        .delete()
    },
    updateSuggestion(knex, id, newSuggestionFields) {
      return knex('Suggestion')
        .where({ id })
        .update(newSuggestionFields)
    },
  }
  
  module.exports = SuggestionsService