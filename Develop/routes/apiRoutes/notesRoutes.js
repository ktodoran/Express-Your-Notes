const router = require('express').Router();
const {  locateNoteById, createBrandNewNote, deleteChosenNote } = require('../../lib/notes');
const { notes } = require('../../db/notes.json');

//return existing notes list
router.get('/notes', (req, res) =>{
    res.json(notes);
});

router.post('/notes', (req, res) => {
    //give request an id based on its position in the array or notes
    req.body.id = notes.length.toString();

    //we don't need to validate here because it is performed on the client side
    //the save button doesn't appear until both required form sections are filled
    
    //create new note
    const note = createBrandNewNote(req.body, notes);
    res.json(note);

});

router.delete('/notes/:id', (req, res) => {
    //make sure the note exists before trying to delete
    let found = locateNoteById(req.params.id, notes);
    //if does exist, delete and return the remaining notes
    if(found){
        let newArr = deleteChosenNote(found, notes);
        res.json(newArr);
    }
    else{
        window.alert(`Could not delete note. Please ensure note exists and try again.`);
    }
});

module.exports = router;