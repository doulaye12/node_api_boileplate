const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes');
const AppError = require('./src/utils/AppError');

const app = express();

// ─── Middlewares globaux ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Route de santé ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Gestion des routes inconnues ─────────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} introuvable`, 404));
});

// ─── Gestionnaire d'erreurs global ────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
