const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('📡 Database Connected for Seeding...'))
    .catch(err => {
        console.error(`❌ Connection Error: ${err.message}`);
        process.exit(1);
    });

const generateUsers = () => {
    const users = [];
    for (let i = 1; i <= 100; i++) {
        users.push({
            name: `Test User ${i}`,
            email: `user${i}@example.com`,
            password: `password123` 
        });
    }
    return users;
};

const mockEvents = [
    {
        title: "TechSprint Hackathon 2026",
        description: "The ultimate 48-hour endurance race to build production-grade software engines.",
        eventDate: new Date("2026-07-15"),
        totalTickets: 150,
        availableTickets: 150
    },
    {
        title: "Google Cloud Study Jam",
        description: "Deep dive into cloud architectures, containerization, and serverless compute clusters.",
        eventDate: new Date("2026-08-01"),
        totalTickets: 200,
        availableTickets: 200
    },
    {
        title: "MERN Stack Flash Workshop",
        description: "Mastering high-performance backend routing and complex MongoDB pipelines.",
        eventDate: new Date("2026-06-25"),
        totalTickets: 50,
        availableTickets: 50 
    },
    {
        title: "AI Predictive Modeling Summit",
        description: "Exploring state-of-the-art applications in agricultural forecasting and predictive monitoring.",
        eventDate: new Date("2026-09-10"),
        totalTickets: 300,
        availableTickets: 300
    },
    {
        title: "Global Tech Innovation Conclave",
        description: "Connecting enterprise architects, engineering students, and builders.",
        eventDate: new Date("2026-10-05"),
        totalTickets: 500,
        availableTickets: 500
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        console.log('🗑️ Existing data purged from database...');

        await User.insertMany(generateUsers());
        await Event.insertMany(mockEvents);

        console.log('✅ 100 Users and 5 High-Demand Events successfully seeded!');
        process.exit(0); 
    } catch (error) {
        console.error(`❌ Data Import Failed: ${error.message}`);
        process.exit(1);
    }
};

importData();