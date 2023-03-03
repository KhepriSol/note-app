// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Set up the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Read and write data to JSON file
const allNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
function writeNotes(notesArray) {
  fs.writeFileSync('./db/db.json', JSON.stringify(notesArray));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(allNotes);
});


// Note posting
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = allNotes.length + 1;
  allNotes.push(newNote);
  writeNotes(allNotes);
  res.json(newNote);
});


// Delete notes
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  const noteToDelete = allNotes.find((note) => note.id == idToDelete);
  const indexToDelete = allNotes.indexOf(noteToDelete);
  allNotes.splice(indexToDelete, 1);
  writeNotes(allNotes);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
