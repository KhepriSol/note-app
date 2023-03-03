"use strict";

var express = require('express');

var path = require('path');

var fs = require('fs');

var util = require('util');

var app = express();
var PORT = process.env.PORT || 3000; // Setup async file handling

var readFileAsync = util.promisify(fs.readFile);
var writeFileAsync = util.promisify(fs.writeFile); // Set up middleware

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express["static"]('public')); // Define API routes

app.get('/api/notes', function _callee(req, res) {
  var data, notes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(readFileAsync('./db/db.json', 'utf8'));

        case 3:
          data = _context.sent;
          notes = JSON.parse(data);
          res.json(notes);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send('Error retrieving notes');

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
app.post('/api/notes', function _callee2(req, res) {
  var note, data, notes;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          note = req.body;
          _context2.next = 4;
          return regeneratorRuntime.awrap(readFileAsync('./db/db.json', 'utf8'));

        case 4:
          data = _context2.sent;
          notes = JSON.parse(data);
          note.id = notes.length + 1;
          notes.push(note);
          _context2.next = 10;
          return regeneratorRuntime.awrap(writeFileAsync('./db/db.json', JSON.stringify(notes)));

        case 10:
          res.json(note);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send('Error saving note');

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
app["delete"]('/api/notes/:id', function _callee3(req, res) {
  var idToDelete, data, notes, newNotes;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idToDelete = parseInt(req.params.id);
          _context3.next = 4;
          return regeneratorRuntime.awrap(readFileAsync('./db/db.json', 'utf8'));

        case 4:
          data = _context3.sent;
          notes = JSON.parse(data);
          newNotes = notes.filter(function (note) {
            return note.id !== idToDelete;
          });
          _context3.next = 9;
          return regeneratorRuntime.awrap(writeFileAsync('./db/db.json', JSON.stringify(newNotes)));

        case 9:
          res.send('Note deleted successfully');
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send('Error deleting note');

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Define HTML routes

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); // Start the server

app.listen(PORT, function () {
  console.log("Server listening on http://localhost:".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
