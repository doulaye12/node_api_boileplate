const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Accès refusé. Token manquant.', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(new AppError('Token invalide ou expiré.', 401));
    }

    // 3. Vérifier que l'utilisateur existe encore
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('Utilisateur introuvable ou désactivé.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware de restriction par rôle
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Accès refusé. Droits insuffisants.', 403));
  }
  next();
};

module.exports = { protect, restrictTo };
