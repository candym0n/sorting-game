const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./user');
const Database = require("../db");

const SECRET_KEY = process.env.SECRET_KEY;


class UserController {
    static async register(req, res) {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), name: res.name, password: res.password });
        }

        const { name, password } = req.body;

        try {
            // Check if the user already exists
            const existingUser = await User.getUserByName(name);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            let userId = await User.createUser(name, hashedPassword);

            // Respond with success
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }

    static async logout(req, res) {
        req.session.token = "";
        res.send({ message: "Logged out!" });
    }

    static async deleteUser(req, res) {
        const token = req.session.token;
        if (token) {
            try {
                const decoded = await jwt.verify(token, process.env.SECRET_KEY);
                await User.deleteUser(decoded.id);
                res.status(200).json({ message: 'Deleted.' });
                req.session.token = "";
            } catch (error) {
                res.status(500).json({ error: 'Unauthorized: ' + req.session.token + ", error is " + error });

            }

        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }

    /**
     * DON'T JUDGE ME.
     * I'M SERIOUS
     */
    static async save(req, res) {
        const token = req.session.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                await Database.Query("INSERT INTO progress (user_id, level_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score=?", decoded.id, req.body.level, req.body.score);
                res.status(200).json({
                    message: "Alright....."
                })
            } catch (error) {
                res.status(500).json({ error: 'Unauthorized: ' + req.session.token + ", error is " + error });
            }
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }

    // By "data" I mean levels with locked/unlocked status and star count
    static async getUserData(req, res) {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), name: req.name, password: req.password });
        }

        const token = req.session.token;
        if (token) {
            try {
                const decoded = await jwt.verify(token, process.env.SECRET_KEY);
                let data = await User.getUserDataById(decoded.id);
                let user = await User.getUserById(decoded.id);
                const levels = await Database.Query("SELECT id, name, level_index FROM `levels` ORDER BY level_index ASC");
                res.status(200).json({
                    data: levels.map(level => {
                        let locked = !data.some(a => a.level_id == level.id);
                        return {
                            name: level.name,
                            index: level.level_index,
                            locked,
                            score: !locked && level.score
                        };
                    }),
                    name: user.name
                });
            } catch (error) {
                res.status(401).json({ error: 'Unauthorized', more: 'Token: ' + req.session.token + ", full error: " + error });
            }

        } else {
            res.status(401).json({ error: 'Unauthorized' });

        }
    }

    static async getUser(req, res) {
        const token = req.session.token;
        if (token) {
            try {
                const decoded = await jwt.verify(token, process.env.SECRET_KEY);
                let user = await User.getUserById(decoded.id);
                res.status(200).json({ name: user.name, id: user.id });
            } catch (error) {
                res.status(401).json({ result: "Not authorized. More info: " + error });
            }
        } else {
            res.status(401).json({ error: "NOT AUTHORIZED" });
        }
    }

    static async login(req, res) {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), name: req.name, password: req.password });
        }

        const { name, password } = req.body;

        try {
            // Fetch the user from the database
            const user = await User.getUserByName(name);
            if (!user) {
                return res.status(401).json({ error: 'Invalid username' });
            }

            // Check if the password matches
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Generate access token
            const token = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: '60m'
            });

            req.session.token = token;

            res.json({
                name: user.name
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}

module.exports = UserController;