const Event = require('../models/Event.js');
const Ticket = require('../models/Ticket.js');
const { acquireLock, releaseLock } = require('../utils/lockManager');
const { ticketQueue } = require('../config/queue');

const bookTicket = async (req, res) => {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
        return res.status(400).json({ success: false, message: 'Please provide userId and eventId' });
    }

    try {
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.availableTickets <= 0) {
            return res.status(400).json({ success: false, message: 'Sold out! No tickets remaining.' });
        }

        const job = await ticketQueue.add('processBooking', {
            userId,
            eventId
        }, {
            jobId: `book-${userId}-${eventId}-${Date.now()}`
        });

        return res.status(202).json({
            success: true,
            message: 'Your ticket request has been received and placed in the processing line.',
            data: {
                jobId: job.id,
                status: 'queued'
            }
        });

    } catch (error) {
        console.error(`❌ Queue Producer Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal server error while queueing order' });
    }
};

module.exports = { bookTicket };

