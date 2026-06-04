const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

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

        // Note: In Week 4, we will introduce a pre-save hook to hash this password using bcrypt!
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

module.exports = {
    registerUser
};