const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Lisää käyttäjä
router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const user = new User({ username, name });
    await user.setPassword(password);
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const users = await User.find({}, { passwordHash: 0 }); // Poista salasana, ettei se näy vastauksessa
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;