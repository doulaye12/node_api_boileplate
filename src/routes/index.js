const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/auth', authRoutes);

// Ajoute ici d'autres ressources :
// router.use('/users',    userRoutes);
// router.use('/products', productRoutes);

module.exports = router;