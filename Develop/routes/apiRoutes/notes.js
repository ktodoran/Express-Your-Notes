const router = require('express').Router();
const {  findNoteById, createNewNote, deleteSelectedNote } = require('../../lib/notes');
const { notes } = require('../../db/db.json');

//return existing notes list
router.get('/notes', (req, res) =>{
    res.json(notes);
});

router.post('/notes', (req, res) => {
    //give request an id based on its position in the array or notes
    req.body.id = notes.length.toString();

    //We don't need to validate here because it is performed on the client side, also, the save button doesn't appear until both required form sections are filled
    
    //Create a new note
    const note = createNewNote(req.body, notes);
    res.json(note);

});

router.delete('/notes/:id', (req, res) => {
    //Determine if the note exists, before deleting
    let found = findNoteById(req.params.id, notes);
    //If the note exists, delete and show previous notes
    if(found){
        let newArr = deleteSelectedNote(found, notes);
        res.json(newArr);
    }
    else{
        window.alert(`Could not delete note. Please ensure note exists and try again.`);
    }
});

module.exports = router;