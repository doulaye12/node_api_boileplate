const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, registerRules, loginRules } = require('../middlewares/validate.middleware');

const router = Router();

// Routes publiques
router.post('/register', registerRules, validate, authController.register);
router.post('/login',    loginRules,    validate, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Routes protégées
router.use(protect);
router.post('/logout', authController.logout);
router.get('/me',      authController.getMe);

module.exports = router;
