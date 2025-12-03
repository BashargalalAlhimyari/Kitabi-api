
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require("../models/user");

exports.register = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const errorMessage = error.array().map((error) => ({ message: error.msg, field: error.path }));
        return res.status(400).json({ message: errorMessage });
    }
    try {
        console.log(req.body);
        // const { user_name, user_email, phone, user_password } = req.body;
        user_password = await bcrypt.hash(req.body.user_password, 10) //this will hash the password , 10 is the number of rounds 

        const user = new User({ ...req.body, user_password });
        const result = await user.save();
        if (!result) {
            return res.status(400).json({ message: ' could not create user' });
        }
        return res.status(201).json({ message: result });
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            return res.status(409).json({ message: 'User already exists' });
        }
        return res.status(500).json({ message: error.message, type: "Internal Server Error" });
    }
}

exports.login = async (req, res) => {

    try {
        let { user_email, user_password } = req.body
        if (!user_email || !user_password) {
            return res.status(400).json({ message: 'yore email and password are required' });
        }

        const user = await User.findOne({ user_email: user_email })
        
        if (!user) {
            return res.status(404).send({ status: "FAIL", data: { user: "user not found" } })
        }

        const matchPassword = await bcrypt.compare(user_password, user.user_password)
        
         if (user && matchPassword) {

            return res.status(200).send({ message :" success" })
        } else {
            return res.status(400).send({ status: "FAIL", message: "Invalid credentials" })
        }
    } catch (e) {
        return res.status(500).json({ message: e.message, type: "Internal Server Error" });

    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.forgetPassword = async (req, res) => {
}

exports.verifyOtp = async (req, res) => {
}

exports.resetPassword = async (req, res) => {
}
