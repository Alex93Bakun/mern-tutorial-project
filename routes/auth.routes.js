const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Has to be at least 6 characters long').isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        try {
            const errors = await validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data',
                });
            }

            const { email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).json({ message: 'User created' });
        } catch (e) {
            res.status(500).json({
                message: 'Something went wrong, please try again.',
            });
        }
    }
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter a valid email address')
            .normalizeEmail()
            .isEmail(),
        check('password', 'Enter a password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = await validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login data',
                });
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'user not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'password incorrect' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(500).json({
                message: 'Something went wrong, please try again.',
            });
        }
    }
);

module.exports = router;
