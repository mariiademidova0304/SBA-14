const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../utils/auth');

router.use(authMiddleware);

router.post('/api/bookmarks', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to see this!' });
        }
        const bookmark = await Bookmark.create({
            ...req.body,
            // The user ID needs to be added here
            user: req.user._id
        });
        res.status(201).json(bookmark);
    } catch (err) {
        res.status(400).json(err);
    }
})

router.get('/api/bookmarks', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to see this!' });
        }
        const bookmarks = await Bookmark.find({ user: req.user._id });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/api/bookmarks/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to see this!' });
        }
        let bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });
        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id!' });
        }
        return res.json(bookmark);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/api/bookmarks/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to see this!' });
        }
        let bookmark = await Bookmark.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id!' });
        }
        return res.json(bookmark);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/api/bookmarks/:id', async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'You must be logged in to see this!' });
        }
        const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id!' });
        }
        return res.status(200).json({ message: 'Bookmark successfully deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;