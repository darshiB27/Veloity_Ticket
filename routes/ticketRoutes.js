const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { bookTicket } = require('../controllers/ticketController');

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Database fetch failure.' });
    }
});

router.post('/book', bookTicket);

module.exports = router;