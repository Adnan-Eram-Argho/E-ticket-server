const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = require("../Schemas/userSchema");
const User = mongoose.model("User", userSchema);

// POST: Create a new user
router.post('/signup', async (req, res) => {
    try {
        // Hash the password with a salt rounds value of 10
        const hashedPass = await bcrypt.hash(req.body.password, 10);

        // Create a new user instance
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        });

        // Save the user to the database
        await newUser.save();

        // Respond with a success message
        res.status(200).json({
            message: "User was inserted successfully"
        });
    } catch (err) {
        // Log the error and respond with an error message
        console.error(err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// POST: Login a user
router.post('/login', async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "Authentication error: User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Authentication error: Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign({
            name: user.name,
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Respond with the token
        res.status(200).json({
            token: token,
            message: "Login successful"
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            error: "There was an error during login",
            details: err.message
        });
    }
});

// GET: Retrieve all users
router.get('/', async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({
            message: "Users retrieved successfully",
            result: data
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// GET: Retrieve a user by ID
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id);
        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            result: userData
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// PATCH: Update a user by ID
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true, // Return the updated document
            runValidators: true // Ensure the updates adhere to the schema
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// DELETE: Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const userData = await User.findByIdAndDelete(req.params.id);
        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User deleted successfully",
            result: userData
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

module.exports = router;
