let titleForNote;
let textInNote;
let saveBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  titleForNote = document.querySelector('.note-title');
  textInNote = document.querySelector('.note-textarea');
  saveBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// livingNote is used to keep track of the note in the textarea
let livingNote = {};

const grabNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderLivingNote = () => {
  hide(saveBtn);

  //change back to livingNote.id after addition of id
  if (livingNote.id) {
    titleForNote.setAttribute('readonly', true);
    textInNote.setAttribute('readonly', true);
    titleForNote.value = livingNote.title;
    textInNote.value = livingNote.text;
  } else {
    titleForNote.removeAttribute('readonly');
    textInNote.removeAttribute('readonly');
    titleForNote.value = '';
    textInNote.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: titleForNote.value,
    text: textInNote.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderLivingNote();
  });
};

// Delete the clicked note
const handleNoteDeletion = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (livingNote.id === noteId) {
    livingNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderLivingNote();
  });
};

// Sets the livingNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  livingNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderLivingNote();
};

// Sets the livingNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  livingNote = {};
  renderLivingNote();
};

const handleRenderSaveBtn = () => {
  if (!titleForNote.value.trim() || !textInNote.value.trim()) {
    hide(saveBtn);
  } else {
    show(saveBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDeletion);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => grabNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  titleForNote.addEventListener('keyup', handleRenderSaveBtn);
  textInNote.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
