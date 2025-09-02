const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport')
const authMiddleware = require('../utils/auth');

const secret = process.env.JWT_SECRET;

router.post('/api/users/register', async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email has already been used.' });
        } else {
            const user = await User.create(req.body);
            return res.status(201).json(user)
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect email or password.' });
        }

        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            return res.status(400).json({ error: 'Incorrect email or password.' });
        }

        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign({ data: payload }, secret, { expiresIn: '2h' });
        return res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/api/users/profile', authMiddleware, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to see this!' });
    }

    res.status(200).json(req.user);
});

router.get('/api/users/auth/github', passport.authenticate('github'));
router.get('/api/users/auth/github/callback', passport.authenticate('github'), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to see this!' });
    }

    const payload = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    };

    const token = jwt.sign({data: payload}, secret, {expiresIn: '2h'});
    res.redirect(`/api/users/profile?token=${token}`);

})

module.exports = router;