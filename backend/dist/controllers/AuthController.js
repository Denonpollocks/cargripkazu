"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = require("../config");
class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, country, company } = req.body;
            // Check if user already exists
            const existingUser = await User_1.default.findOne({ email });
            if (existingUser) {
                res.status(400).json({ error: 'Email already registered' });
                return;
            }
            // Create new user
            const user = new User_1.default({
                email,
                password,
                firstName,
                lastName,
                phone,
                country,
                company
            });
            await user.save();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error registering user' });
        }
    }
    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    }
    // Get current user
    async getCurrentUser(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const user = await User_1.default.findById(userId).select('-password');
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    }
}
exports.AuthController = AuthController;
