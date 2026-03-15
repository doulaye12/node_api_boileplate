const sequelize = require('../config/database');
const UserModel = require('./user.model');

// Initialisation des modèles
const User = UserModel(sequelize);

// ─── Associations (à compléter selon les besoins) ─────────────────────────────
// Ex: User.hasMany(Post); Post.belongsTo(User);

module.exports = { sequelize, User };
