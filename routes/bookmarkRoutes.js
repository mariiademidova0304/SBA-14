const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../utils/auth');

//to access these routes the user will need to pass authentication
router.use(authMiddleware);
//all routes will also include filtering by user's id to only show/edit user accessible posts

//creaeting a bookmark with req.body and user's id
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

//getting all marks of the user:id
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

//getting a specific bookmark of the user
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

//changing a specific bookmark of the user
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

//deleting a specific bookmark of the user
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