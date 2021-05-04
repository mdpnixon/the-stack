const Deck = require('../models/deck');
const User = require('../models/user');
const fetch = require('node-fetch');
const rootURL = 'https://api.scryfall.com/cards/autocomplete?q=';
const fuzzyURL = 'https://api.scryfall.com/cards/named?fuzzy=';

module.exports = {
    index,
    new: newDeck,
    create,
    addCard,
    show,
    search,
    deleteDeck
}

async function index(req, res) {
    await User.findById(req.user.id).populate('decks').exec((err, decks) => {
        res.render('decks/index', {
            user: req.user,
            decks: decks.decks
        });
    })
}

function newDeck(req, res) {
    res.render('decks/new.ejs', { user: req.user });
}

function create(req, res) {
    const deck = new Deck(req.body);
    deck.save(async function(err) {
      if (err) return res.redirect('/decks/new');
      req.user.decks.push(deck.id);
      await req.user.save();
      res.redirect('/decks');
    });
}

async function deleteDeck(req, res) {
    let deck = await Deck.findById(req.params.id)
    deck.remove()
    res.redirect('/decks')
}

async function show(req, res) {
    let myDeck = await Deck.findById(req.params.id);
    myDeck = await myDeck.execPopulate('cards');
    res.render('decks/show.ejs', {
      user: req.user,
      deck: myDeck,
    })
}

function addCard(req, res, next) {
    Deck.findById(req.params.id, function(err, deck) {
        deck.cards.push({
            name: req.body.name,
            manaCost: req.body.mana_cost,
            type: req.body.type_line
        });
        deck.save(function(err) {
            res.redirect(`/decks/${deck._id}/search`);
        })
    });
}

async function search(req, res, next) {
    let myDeck = await Deck.findById(req.params.id);
    let body;
    let result;
    let searched = [];
    let check = false;
    if (req.query.name) {
        const card = req.query.name;
        const response = await fetch(rootURL + card);
        result = await response.json();
        for (c of result.data) {
            const fuzzy = await fetch(fuzzyURL + c);
            body = await fuzzy.json();
            searched.push(body)
        }
        check = true;
        res.render('decks/search.ejs', {
            user: req.user,
            searched: searched,
            check: check,
            deck: myDeck,
            body: body
        });
    } else {
        res.render('decks/search.ejs', {
            user: req.user,
            searched: searched,
            check: check,
            deck: myDeck,
            body: body
        });
    }
}

