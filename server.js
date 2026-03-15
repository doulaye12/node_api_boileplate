require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connexion et synchronisation de la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL établie avec succès.');

    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec la base de données.');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📌 Environnement : ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur :', error);
    process.exit(1);
  }
};

startServer();
