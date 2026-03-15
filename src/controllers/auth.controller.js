const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

// ─── POST /api/v1/auth/register ───────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });

    return ApiResponse.created(res, result, 'Compte créé avec succès.');
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return ApiResponse.success(res, result, 'Connexion réussie.');
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/v1/auth/refresh-token ─────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    return ApiResponse.success(res, tokens, 'Tokens renouvelés avec succès.');
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/v1/auth/logout ─────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    return ApiResponse.success(res, null, 'Déconnexion réussie.');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/auth/me ──────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return ApiResponse.success(res, { user }, 'Profil récupéré avec succès.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, getMe };
