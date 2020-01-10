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
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // res.send("notpad main");
});

//When the get started button is clicked on the index.html routing goes to notes.html
app.get("/notes", function(req, res) {
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


// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
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
     data[data.length - 1].id=data.length-1;

   // once the new note is pushed to the end of the data array, write the existing 
   //notes and newly added note back to the db.json file
    writeFileAsync("./db/db.json", JSON.stringify(data));
})

  res.json("yay you made a post!");
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
