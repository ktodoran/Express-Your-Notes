const path = require('path');
const router = require('express').Router();

//return the notes page
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/notes.html'));
});

//wildcard selector to return the index file for any requests except '/notes' or '/api/notes'
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;