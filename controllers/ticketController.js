const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// @desc    Book a ticket (Standard Monolith - Intentionally Vulnerable to Race Conditions)
// @route   POST /api/tickets/book
// @access  Public (For now)
const bookTicket = async (req, res) => {
    try {
        const { userId, eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ success: false, message: 'Please provide userId and eventId' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.availableTickets <= 0) {
            return res.status(400).json({ success: false, message: 'Sold out! No tickets remaining.' });
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        event.availableTickets -= 1;
        await event.save();

        const ticket = await Ticket.create({
            user: userId,
            event: eventId
        });

        return res.status(201).json({
            success: true,
            message: 'Ticket booked successfully!',
            data: {
                ticketId: ticket._id,
                eventTitle: event.title,
                remainingTickets: event.availableTickets
            }
        });

    } catch (error) {
        console.error(`❌ Booking Pipeline Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error during booking' });
    }
};

module.exports = { bookTicket };