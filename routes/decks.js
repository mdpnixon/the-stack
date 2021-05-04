var express = require('express');
var router = express.Router();

let decksCtrl = require('../controllers/decks');

router.get('/', isLoggedIn, decksCtrl.index);
router.get('/new', isLoggedIn, decksCtrl.new);
router.get('/:id/search', isLoggedIn, decksCtrl.search);
router.get('/:id', isLoggedIn, decksCtrl.show);
router.post('/', isLoggedIn, decksCtrl.create);
router.post('/delete/:id', isLoggedIn, decksCtrl.deleteDeck);
router.post('/:id', isLoggedIn, decksCtrl.addCard);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;