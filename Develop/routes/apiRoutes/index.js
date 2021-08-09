const router = require('express').Router();
const noteRoutes = require('../apiRoutes/notesRoutes.js');

router.use(noteRoutes);

module.exports = router;