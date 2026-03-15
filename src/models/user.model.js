const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: 'Ce nom d\'utilisateur est déjà pris.' },
        validate: {
          len: { args: [3, 50], msg: 'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères.' },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: { msg: 'Cet email est déjà utilisé.' },
        validate: {
          isEmail: { msg: 'Veuillez fournir un email valide.' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [6, 100], msg: 'Le mot de passe doit contenir au moins 6 caractères.' },
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'refresh_token',
      },
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // ─── Méthodes d'instance ──────────────────────────────────────────────────
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toSafeObject = function () {
    const { password, refreshToken, ...safeUser } = this.toJSON();
    return safeUser;
  };

  return User;
};
