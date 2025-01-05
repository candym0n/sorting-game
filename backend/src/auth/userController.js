const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./user');

const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
    static async register(req, res) {
        // Input validation
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), name: res.name, password: res.password });
        }
        
        const { name, password } = req.body;
        
        try {
            // Check if the user already exists
            const existingUser = await User.getUserByName(name);
            if(existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create a new user
            let userId = await User.createUser(name, hashedPassword);

            // Respond with success
            res.status(201).json({ message: 'User registered successfully'});
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
    
    static async logout(req, res) {
        req.session.token = "";
        res.send({ message: "Logged out!"} );
    }
    
    static async deleteUser(req, res) {
        const token = req.session.token;
         if (token) {
             try {
                 const decoded = await jwt.verify(token, process.env.SECRET_KEY);
                 await User.deleteUser(decoded.id);
                 res.status(200).json({ message: 'Deleted.'});
                 req.session.token = "";
             } catch (error) {
                 res.status(500).json({ error: 'Unauthorized: ' + req.session.token + ", error is " + error });
                 
             }
             
         } else {
             res.status(401).json({ error: 'Unauthorized' });
         }
    }
    
    static async save(req, res) {
        const token = req.session.token;
         if (token) {
             try {
                 const decoded = await jwt.verify(token, process.env.SECRET_KEY);
                 await User.changeUserSave(decoded.id, req.body);
                 res.status(200).json({ message: 'Changed!'})
             } catch (error) {
                 res.status(500).json({ error: 'Unauthorized: ' + req.session.token + ", error is " + error });
                 
             }
             
         } else {
             res.status(401).json({ error: 'Unauthorized' });
         }
    }
    
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
                 let user = await User.getUserById(decoded.id);
                 res.status(200).json({
                    name: user.name,
                    data: user.data
                 });
             } catch (error) {
                 res.status(401).json({ error: 'Unauthorized', more: 'Token: ' + req.session.token + ", full error: " + error});
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
                res.status(200).json( { result: user.name } );
            } catch (error) {
                res.status(401).json({ result: "" });
            }
        } else {
            res.status(401).json({ result: "" });
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
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Check if the password matches
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Generate access token
            const token = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: '60m'
            });
            
            req.session.token = token;

            res.json({
                name: user.name,
                data: user.data
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}

module.exports = UserController;