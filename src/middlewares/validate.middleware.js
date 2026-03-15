const { validationResult, body } = require('express-validator');
const AppError = require('../utils/AppError');

// ─── Exécuteur de validation ──────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(messages, 422));
  }
  next();
};

// ─── Règles de validation ─────────────────────────────────────────────────────
const registerRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur est requis.')
    .isLength({ min: 3, max: 50 }).withMessage('Entre 3 et 50 caractères.'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 6 }).withMessage('Minimum 6 caractères.'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),
];

module.exports = { validate, registerRules, loginRules };
