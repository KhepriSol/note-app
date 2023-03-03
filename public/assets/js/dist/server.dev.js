"use strict";

var express = require('express');

var path = require('path');

var fs = require('fs');

var util = require('util'); //handling async processes


var readFileAsync = util.promisify(fs.readFile);
var writeFileAsync = util.promisify(fs.writeFile); //setting up server

var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // middleware

app.use(express["static"]('./develop.public')); //API Route and Get REquest

app.get('/api/notes', function (req, res) {
  readFileAsync('./develop/db/db.json', 'utf8').then(function (data) {
    notes = [].concat(JSON.parse(data));
    res.json(notes);
  });
}); //api route and post req

app.post('/api/notes', function (req, res) {
  var note = req.body;
  readFileAsync('./develop/db/db.son', 'utf8').then(function (data) {
    var notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1;
    notes.push(note);
    return notes;
  }).then(function (notes) {
    writeFileAsync('./develop/db/db.json', JSON.stringify(notes));
    res.son(note);
  });
}); //delete

app["delete"]('api/notes/:id', function (req, res) {
  var idToDelete = parseInt(req.params.id);
  readFileAsync('./develop/db/db.json', 'utf8').then(function (data) {
    var notes = [].concat(JSON.parse(data));
    var newNotesData = [];

    for (var i = 0; i < notes.length; i++) {
      if (idToDelete !== notes[i].id) {
        newNotesData.push(notes[i]);
      }
    }

    return newNotesData;
  }).then(function (notes) {
    writeFileAsync('./develop/db/db.json', JSON.stringify(notes));
    res.send('saved success!');
  });
}); //html Routes

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './develop/public/index.html'));
});
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './develop/public/index.html'));
}); //listening uwu

app.listen(PORT, function () {
  console.log('app listening on Port' + PORT);
});
//# sourceMappingURL=server.dev.js.map
