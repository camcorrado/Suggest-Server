const SuggestionsService = {
    getAllSuggestions(knex) {
        return knex.select('*').from('suggestions')
    },
    insertSuggestion(knex, newSuggestion) {
        return knex
            .insert(newSuggestion)
            .into('suggestions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('suggestions').select('*').where('id', id).first()
    },
    deleteSuggestion(knex, id) {
        return knex('suggestions')
            .where({ id })
            .delete()
    },
    updateSuggestion(knex, id, newSuggestionFields) {
        return knex('suggestions')
            .where({ id })
            .update(newSuggestionFields)
    },
}
  
  module.exports = SuggestionsService