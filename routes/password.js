const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
    try {
        res.render('password/index')
    } catch {
        res.redirect('/login')
    }
})

router.get('/reset-sent', (req, res) => {
    try {
        res.render('password/reset-sent')
    } catch {
        res.redirect('/login')
    }
})

router.post('/forgot-password', async (req, res) => {
    try {
        const email = req.body.email
        const users = await User.find({})
        const user = users.find( user => user.email.toString() === email.toString())

        console.log(user)

        if (!user) {
            console.log('in if')
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a unique reset token
        const resetToken = crypto.randomBytes(16).toString('hex')
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send password reset email
        const transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
              user: 'chr0mestarsgg@gmail.com',
              pass: 'wucgsgsswbkzeprh', // Use an App Password if 2FA is enabled
            },
         });

        const mailOptions = {
            from: 'CHROMESTARS <chr0mestarsgg@gmail.com>',
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://localhost:3000/password/reset-password/${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions)

        res.redirect('/password/reset-sent')

    } catch {
        //res.redirect('/login')
    }
})

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is valid and not expired
        });

        if (!user) {
            return res.status(400).send('Invalid or expired password reset token.');
        }

        // If using server-side rendering:
         res.render('password/reset-password', { token }) // Render reset form with token

        // If using frontend (React/Vue), you can redirect or just confirm the token is valid:
        // res.send('Token is valid. You can now reset your password.');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    console.log('/reset-password/:token')
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = await bcrypt.hash(password, 10); // Hash the password before saving
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(500).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
})

module.exports = router