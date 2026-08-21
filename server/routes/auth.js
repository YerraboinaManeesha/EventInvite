
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash
    });

    req.session.userId = user._id.toString();

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          error: 'Unable to create login session.'
        });
      }

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email
      });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Something went wrong creating your account.'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const match = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!match) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    req.session.userId = user._id.toString();

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          error: 'Unable to create login session.'
        });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email
      });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Something went wrong logging in.'
    });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Unable to log out.'
      });
    }

    res.clearCookie('connect.sid');

    res.json({
      ok: true
    });
  });
});

router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Not logged in.'
      });
    }

    const user = await User.findById(req.session.userId)
      .select('name email');

    if (!user) {
      return res.status(401).json({
        error: 'Not logged in.'
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Unable to check login status.'
    });
  }
});

module.exports = router;
