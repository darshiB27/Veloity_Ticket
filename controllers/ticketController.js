const Event = require('../models/Event.js');
const Ticket = require('../models/Ticket.js');
const { acquireLock, releaseLock } = require('../utils/lockManager');
const { ticketQueue } = require('../config/queue');

// @desc    Book a ticket (Standard Monolith - Intentionally Vulnerable to Race Conditions)
// @route   POST /api/tickets/book
// @access  Public (For now)

// ==========================================
// APPROACH 3: ASYNCHRONOUS PRODUCER PATTERN (BULLMQ)
// @desc    Produce a ticket booking job into the background processing queue
// @route   POST /api/tickets/book
// ==========================================
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

// ==========================================
// APPROACH 1: PESSIMISTIC LOCKING (REDIS SETNX)
// ==========================================
/* (The previous working bookTicket implementation remains a great reference point)

const bookTicket = async (req, res) => {
        const { userId, eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ success: false, message: 'Please provide userId and eventId' });
        }

        const lockAcquired = await acquireLock(eventId, 2000);
    
        if (!lockAcquired) {
            return res.status(429).json({
                success: false,
                message: 'Server is processing concurrent orders. Please try again in a moment.'
            });
        }

        try {
            const event = await Event.findById(eventId);
            if (!event) {
                await releaseLock(eventId); 
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            if (event.availableTickets <= 0) {
                await releaseLock(eventId); 
                return res.status(400).json({ success: false, message: 'Sold out! No tickets remaining.' });
            }
                    /*(previous code)
                            const event = await Event.findById(eventId);
                            if (!event) {
                                return res.status(404).json({ success: false, message: 'Event not found' });
                            }

                            if (event.availableTickets <= 0) {
                                return res.status(400).json({ success: false, message: 'Sold out! No tickets remaining.' });
                            }
                    */
            /*
            await new Promise(resolve => setTimeout(resolve, 50));

            event.availableTickets -= 1;
            await event.save();

            const ticket = await Ticket.create({
                user: userId,
                event: eventId
            });

            await releaseLock(eventId);

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
        await releaseLock(eventId);
        console.error(`❌ Booking Pipeline Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error during booking' });
        }
    };
    module.exports = { bookTicket };
*/

// ==========================================
// APPROACH 2: OPTIMISTIC CONCURRENCY CONTROL (OCC)
// @desc    Book a ticket (Protected with Optimistic Document Versioning Check)
// @route   POST /api/tickets/book
// ==========================================
/*
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
        await new Promise(resolve => setTimeout(resolve, 50));

        // ATOMIC CONDITIONAL UPDATE (The OCC Core)
        const updatedEvent = await Event.findOneAndUpdate(
            { 
                _id: eventId, 
                __v: event.__v 
            },
            { 
                $inc: { availableTickets: -1, __v: 1 } 
            },
            { returnDocument: 'after' } 
        );

        if (!updatedEvent) {
            return res.status(409).json({
                success: false,
                message: 'Conflict detected. The ticket inventory changed while processing your request. Please retry.'
            });
        }

        const ticket = await Ticket.create({
            user: userId,
            event: eventId
        });

        return res.status(201).json({
            success: true,
            message: 'Ticket booked successfully via OCC!',
            data: {
                ticketId: ticket._id,
                eventTitle: updatedEvent.title,
                remainingTickets: updatedEvent.availableTickets,
                currentVersion: updatedEvent.__v
            }
        });

    } catch (error) {
        console.error(`❌ OCC Booking Pipeline Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error during OCC booking' });
    }
};

module.exports = { bookTicket };
*/

