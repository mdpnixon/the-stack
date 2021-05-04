const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: String,
    manaCost: String,
    type: String
});

const deckSchema = new Schema({
  name: String,
  cards: [cardSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Deck', deckSchema);