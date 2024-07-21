const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (err) {
    res.status(400).send('Error registering new user');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).send('Error logging in');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(400).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
