// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var util = require("util");
var fs = require("fs");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// Sets up the Express App
// =============================================================
var app = express();
//In order to make sure your server works on local & heroku you have to make sure the commandline looks like this
//process.env.PORT=heroku's port or local port
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({
    extended: true
}));


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // res.send("notpad main");
});

//When the get started button is clicked on the index.html routing goes to notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  // res.send("open notes page");
});



// GET read the `db.json` file and return the saved notes in json
app.get("/api/notes", function (req, res) {
  readFileAsync("./db/db.json", "utf8").then(function (data) {

    data = JSON.parse(data)
    console.log("get/api/notes from db");
    console.log(data)
    return res.json(data);

  })
});


// Route for deleting a note from the json.db by id
app.delete("/api/notes/:id", function (req, res) {
  readFileAsync("./db/db.json", "utf8").then(function (data) {
    console.log("api delete note");
    var deleteid = req.params.id;
    // console.log(deleteid);
    //read the db.json file to grab the arrays of object and return json
    readFileAsync("./db/db.json", "utf8").then(function (data) {
      //turn object into string
      data = JSON.parse(data)

      //Splice (remove the note with the matching id)
      data.splice(deleteid, 1);

      //adjust the ids to account for the removed note
      for (let i = 0; i < data.length; i++) {
        data[i].id = i;
      };

      //Write the array of notes back to db.json
      writeFileAsync("./db/db.json", JSON.stringify(data));
    })
    return res.send("note with " + deleteid + " deleted");
    // return res.json(false);
  })
});

// Create New Notes - takes in JSON input
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  //New notes it the note that was just saved by user.
  var newNotes = req.body;

  console.log(newNotes);
  //read the db.json file that has an array of saved notes
  readFileAsync("./db/db.json", "utf8").then(function (data) {
    data = JSON.parse(data)

    //  push the new data into the db.json
    data.push(newNotes);
    console.log(data);

    //add an id to the note that is the index of the array
    data[data.length - 1].id = data.length - 1;

    // once the new note is pushed to the end of the data array, write the existing 
    //notes and newly added note back to the db.json file
    writeFileAsync("./db/db.json", JSON.stringify(data));
  })

  res.json("yay you made a post!");
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
