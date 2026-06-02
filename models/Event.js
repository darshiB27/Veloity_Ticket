const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Add an event description']
    },
    eventDate: {
        type: Date,
        required: [true, 'Specify the event date']
    },
    totalTickets: {
        type: Number,
        required: [true, 'Total tickets count is required']
    },
    availableTickets: {
        type: Number,
        required: [true, 'Available tickets count is required'],
        min: [0, 'Available tickets cannot drop below zero']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

eventSchema.index({ availableTickets: 1 });

module.exports = mongoose.model('Event', EventSchema);