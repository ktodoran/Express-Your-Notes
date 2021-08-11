const fs = require("fs");
const path = require("path");

//find the specified note by id
function locateNoteById(id, notesArr){
    const result = notesArr.filter(note => note.id === id)[0];
    return result;
};

//create a new note and add to the notes json file
function createBrandNewNote(body, notesArr){
    const note = body;
    notesArr.push(note);
    fs.writeFileSync(
        path.join(__dirname, '../db/notes.json'),
        JSON.stringify({ notes: notesArr }, null, 2)
    );
    return note;
};

//loop through the notes file and remove the selected note by matching id. Then update the json file
function deleteChosenNote(body, notesArr){
    notesArr.forEach(note => {
        if(note.id === body.id){
            notesArr.splice(notesArr.indexOf(note), 1);
            fs.writeFileSync(
                path.join(__dirname, '../db/notes.json'),
                JSON.stringify({ notes: notesArr }, null, 2)
            );
        }
    });
    return notesArr;
};

module.exports = { locateNoteById, createBrandNewNote, deleteChosenNote };