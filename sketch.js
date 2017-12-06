// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// Get input from user
var exclamationInput;
var adjectiveInput;
var adverbInput;
var nounInput1;
var nounInput2;
var database;

function setup() {
  noCanvas();

  var config = {
    apiKey: "AIzaSyAWbs0fBS0Zw2JPtbjJ3ehu1Jx3fPeYcIc",
    authDomain: "scoreboard-8b683.firebaseapp.com",
    databaseURL: "https://scoreboard-8b683.firebaseio.com",
    projectId: "scoreboard-8b683",
    storageBucket: "scoreboard-8b683.appspot.com",
    messagingSenderId: "529814826259"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  var madlib = database.ref('madlibs');

  madlib.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();

      for (var key in childSnapshot.val()) 
      {
          console.log(childData[key]["naam"]);
      }

      document.getElementById('exclamation').innerHTML=childData["1"]["naam"];
      document.getElementById('adj').innerHTML=childData["2"]["naam"];
      document.getElementById('adv').innerHTML=childData["3"]["naam"];
      document.getElementById('noun1').innerHTML=childData["4"]["naam"];
      document.getElementById('noun2').innerHTML=childData["5"]["naam"];


    });
});
  
  // Submit button
  var submit = select('#submit');
  submit.mousePressed(getFromFirebase);

}


// This is a function for sending data
function sendFirebase() {
  // Make an object with data in it
  var data = {
    exclamation: exclamationInput.value(),
    adjective: adjectiveInput.value(),
    adverb: adverbInput.value(),
    noun1: nounInput1.value(),
    noun2: nounInput2.value()
  }

  var madlibs = database.ref('madlibs');
  var madlib = madlibs.push(data, finished);
  console.log("Firebase generated key: " + madlib.key);

  // Reload the data for the page
  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('Data saved successfully');
      generate(data, madlib.key);
    }
  }

}

// This is a function for getting data
function getFromFirebase() {
  // Make an object with data in it
  var data = {
    exclamation: exclamationInput.value(),
    adjective: adjectiveInput.value(),
    adverb: adverbInput.value(),
    noun1: nounInput1.value(),
    noun2: nounInput2.value()
  }

  var madlibs = database.ref('madlibs');

  madlibs.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      console.log(childData);
    });
});

  console.log("Firebase generated key: " + madlib.key);
}

function generate(data, key) {
  var txt = '"$exclamation$!" she said $adverb$ as she jumped into her convertible $noun1$ '
           + 'and drove off with her $adjective$ $noun2$.';

  var madlib = txt.replace(/\$(.*?)\$/g, replacer);

  function replacer(match, what) {
    var newtext = data[what];

    if (what === 'Exclamation') {
      newtext = newtext.replace(/^(.)/, capitalize);
      function capitalize(match, firstLetter) {
        return firstLetter.toUpperCase();
      }
    }

    return newtext;
  }
  var par = createDiv(madlib);
  par.parent('madlib');
  par.class('text');

  var id = data.id;
  var a = createA('?id='+key,'permalink');
  a.parent('madlib');
}

function loadOne(id) {
  var ref = database.ref("madlibs/" + id);
  ref.on("value", gotOne, errData);

  function errData(error) {
    console.log("Something went wrong.");
    console.log(error);
  }

  function gotOne(data) {
    generate(data.val(), id);
  }
}

