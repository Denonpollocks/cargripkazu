"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected routes
router.get('/me', authMiddleware_1.authMiddleware, authController.getCurrentUser);
exports.default = router;
