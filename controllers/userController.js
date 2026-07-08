const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email, and password' 
            });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'A user with this email already exists' 
            });
        }

        const user = await User.create({
            name,
            email,
            password 
        });
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error(`❌ Registration Error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration pipeline' 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            return res.json({
                success: true,
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid authorization credentials provided.' 
            });
        }
    } catch (error) {
        console.error(`❌ Login Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error during login authentication' });
    }
};

module.exports = {
    registerUser,
    loginUser
};