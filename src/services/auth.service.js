const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

// ─── Génération des tokens JWT ────────────────────────────────────────────────
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

// ─── Inscription ──────────────────────────────────────────────────────────────
const register = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Un compte avec cet email existe déjà.', 409);
  }

  const user = await User.create({ username, email, password });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await user.update({ refreshToken });

  return { user: user.toSafeObject(), accessToken, refreshToken };
};

// ─── Connexion ────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Email ou mot de passe incorrect.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Votre compte est désactivé.', 403);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Email ou mot de passe incorrect.', 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await user.update({ refreshToken });

  return { user: user.toSafeObject(), accessToken, refreshToken };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = async (token) => {
  if (!token) throw new AppError('Refresh token manquant.', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Refresh token invalide ou expiré.', 401);
  }

  const user = await User.findOne({
    where: { id: decoded.id, refreshToken: token },
  });
  if (!user) throw new AppError('Refresh token révoqué.', 401);

  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  await user.update({ refreshToken: newRefreshToken });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Déconnexion ──────────────────────────────────────────────────────────────
const logout = async (userId) => {
  await User.update({ refreshToken: null }, { where: { id: userId } });
};

// ─── Profil ───────────────────────────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('Utilisateur introuvable.', 404);
  return user.toSafeObject();
};

module.exports = { register, login, refreshToken, logout, getProfile };
