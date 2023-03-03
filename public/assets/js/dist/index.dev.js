"use strict";

var noteTitle;
var noteText;
var saveNoteBtn;
var newNoteBtn;
var noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
} // Show an element


var show = function show(elem) {
  elem.style.display = 'inline';
}; // Hide an element


var hide = function hide(elem) {
  elem.style.display = 'none';
}; // activeNote is used to keep track of the note in the textarea


var activeNote = {};

var getNotes = function getNotes() {
  return fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

var saveNote = function saveNote(note) {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
};

var deleteNote = function deleteNote(id) {
  return fetch("/api/notes/".concat(id), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

var renderActiveNote = function renderActiveNote() {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

var handleNoteSave = function handleNoteSave() {
  var newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
}; // Delete the clicked note


var handleNoteDelete = function handleNoteDelete(e) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();
  var note = e.target;
  var noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
}; // Sets the activeNote and displays it


var handleNoteView = function handleNoteView(e) {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
}; // Sets the activeNote to and empty object and allows the user to enter a new note


var handleNewNoteView = function handleNewNoteView(e) {
  activeNote = {};
  renderActiveNote();
};

var handleRenderSaveBtn = function handleRenderSaveBtn() {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
}; // Render the list of note titles


var renderNoteList = function renderNoteList(notes) {
  var jsonNotes, noteListItems, createLi;
  return regeneratorRuntime.async(function renderNoteList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(notes.json());

        case 2:
          jsonNotes = _context.sent;

          if (window.location.pathname === '/notes') {
            noteList.forEach(function (el) {
              return el.innerHTML = '';
            });
          }

          noteListItems = []; // Returns HTML element with or without a delete button

          createLi = function createLi(text) {
            var delBtn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var liEl = document.createElement('li');
            liEl.classList.add('list-group-item');
            var spanEl = document.createElement('span');
            spanEl.innerText = text;
            spanEl.addEventListener('click', handleNoteView);
            liEl.append(spanEl);

            if (delBtn) {
              var delBtnEl = document.createElement('i');
              delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
              delBtnEl.addEventListener('click', handleNoteDelete);
              liEl.append(delBtnEl);
            }

            return liEl;
          };

          if (jsonNotes.length === 0) {
            noteListItems.push(createLi('No saved Notes', false));
          }

          jsonNotes.forEach(function (note) {
            var li = createLi(note.title);
            li.dataset.note = JSON.stringify(note);
            noteListItems.push(li);
          });

          if (window.location.pathname === '/notes') {
            noteListItems.forEach(function (note) {
              return noteList[0].append(note);
            });
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Gets notes from the db and renders them to the sidebar


var getAndRenderNotes = function getAndRenderNotes() {
  return getNotes().then(renderNoteList);
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
//# sourceMappingURL=index.dev.js.map
