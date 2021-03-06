const router = require('express').Router();
const {  locateNoteById, createBrandNewNote, deleteChosenNote } = require('../../lib/notes');
const { notes } = require('../../db/db.json');
const uniqid = require('uniqid'); 

//return existing notes list
router.get('/notes', (req, res) =>{
    res.json(notes);
});

router.post('/notes', (req, res) => {
    //give request an id based on its position in the array or notes
    req.body.id = notes.length.toString();

    //We don't need to validate here because it is performed on the client side, also, the save button doesn't appear until both required form sections are filled
    
    //Create a new note
    const note = createBrandNewNote(req.body, notes);
        if(createBrandNewNote) {
            res.json(uniqid);
        } else {
            return;
        }
        res.json(note);
});

router.delete('/notes/:id', (req, res) => {
    //Determine if the note exists, before deleting
    let found = locateNoteById(req.params.id, notes);
    //If the note exists, delete and show previous notes
    if(found){
        let newArr = deleteChosenNote(found, notes);
        res.json(newArr);
    }
    else{
        window.alert(`Note could not be deleted. Please ensure note exists first.`);
    }
});

module.exports = router;