"use strict";

// Dependencies
var express = require('express');

var fs = require('fs');

var path = require('path'); // Set up the app


var app = express();
var PORT = process.env.PORT || 3001; // Middleware

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express["static"]('public')); // Read and write data to JSON file

var allNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

function writeNotes(notesArray) {
  fs.writeFileSync('./db/db.json', JSON.stringify(notesArray));
} // Routes


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('/api/notes', function (req, res) {
  res.json(allNotes);
});
app.post('/api/notes', function (req, res) {
  var newNote = req.body;
  newNote.id = allNotes.length + 1;
  allNotes.push(newNote);
  writeNotes(allNotes);
  res.json(newNote);
});
app["delete"]('/api/notes/:id', function (req, res) {
  var idToDelete = req.params.id;
  var noteToDelete = allNotes.find(function (note) {
    return note.id == idToDelete;
  });
  var indexToDelete = allNotes.indexOf(noteToDelete);
  allNotes.splice(indexToDelete, 1);
  writeNotes(allNotes);
  res.json(true);
});
app.listen(PORT, function () {
  console.log("App listening on PORT ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
