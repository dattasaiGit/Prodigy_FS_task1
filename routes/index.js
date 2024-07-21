const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
  if (req.session.role === 'admin') {
    return next();
  }
  res.status(403).send('Access Denied');
}

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { role: req.session.role });
});

router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome Admin');
});

module.exports = router;
