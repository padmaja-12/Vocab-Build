// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs


// Add the Firebase products that you want to use

var express         = require("express"),
    bodyParser      = require("body-parser"),
    axios           = require("axios"),
    firebase        = require("firebase/app"),
    flash           = require("connect-flash");
    firebase        = require("firebase/app");
    methodOverride  = require("method-override"),
    app             = express();

    require("firebase/auth");
   require("firebase/firestore");
  
   
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("cookie-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

var firebaseConfig = {
    apiKey: "AIzaSyCKcUqB4zlgI1_Lm3ERX-OqEt5S88vcLRM",
    authDomain: "vocabulary-app-d1420.firebaseapp.com",
    databaseURL: "https://vocabulary-app-d1420.firebaseio.com",
    projectId: "vocabulary-app-d1420",
    storageBucket: "vocabulary-app-d1420.appspot.com",
    messagingSenderId: "425303662292",
    appId: "1:425303662292:web:5eed6ffab0461a4b2d2541",
    measurementId: "G-40WR3HCK0G"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 
var user = firebase.auth().currentUser;


app.use((req,res,next) => {
    res.locals.currentUser = firebase.auth().currentUser;
    res.locals.error = req.flash("danger");
    res.locals.safe  = req.flash("safe");
    next();
});

app.get("/",(req,res) => {
    res.render("landing");
    //console.log("Hi");
});

app.get("/:id/home", (req,res) => {
    var user = firebase.auth().currentUser;
    if(user == null){
        req.flash("danger","Please Login or Signup!!")
        return res.redirect("/");
    }
    let id = req.params.id;
    console.log(id);
    axios.get('https://vocabulary-app-d1420.firebaseio.com/'+ id +'/word.json')
    .then(response => {
         const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        res.render("home",{alphabet : alphabet,id : id});   
    })
    .catch(error => {
        console.log(error);
        req.flash("danger","An error seems to have occured,Please login again!!")
        res.redirect("/");
    })
});


app.get("/:id/home/add", (req,res) => {
    var set = req.query.set;
    let id = req.params.id;
    axios.get('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/word/'+ set + '.json')
    .then(response => {
       // console.log(response.data);
        let word = [];
        for (let key in response.data) {
            word.push(response.data[key]);
        }
        words = word;
        //console.log(word);
        res.render("add", {words : word,set:set,id:id});
    })
    .catch(error => {
        req.flash("danger","Opps You Might Want to try that again")
        res.redirect("/"+ id + "/home/add");
    })
});

app.post("/:id/home/add", (req,res) => {
    let id = req.params.id;
    var set = req.query.set;
    //console.log(req.body);
    if(req.body.word.Learning){
        axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/learning.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
           userid : id
        });
    }
    if(req.body.word.Reviewed){
        axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/reviewed.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
           userid : id
        });
    }
    if(req.body.word.Mastered){
        axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/mastered.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
           userid : id
        });
    }
    axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/word/'+ set + '.json',{
        name : req.body.word.name,
        meaning : req.body.word.meaning,
        mnemonic : req.body.word.mnemonic,
        sentence : req.body.word.sentence,
        userid : id
    })
    .then(response => {
        res.redirect("/"+ id + "/home/add?set="+set);
    })
    .catch(error => {
        console.log(error);
    });
});

app.get("/:id/home/learning",(req,res) => {
    var id = req.params.id;
    var i = req.query.index;
    var name = req.query.name;
    var meaning = req.query.meaning;
    var mnemonic = req.query.mnemonic;
    var sentence = req.query.sentence;
    if(i !== undefined){
        axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/reviewed.json',{
        name : name,
        meaning : meaning,
        mnemonic : mnemonic,
        sentence : sentence
    });
    axios.delete('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/learning/'+i+'.json')
    .then(response => {
        res.redirect('/'+ id + '/home/learning') ;
    })
    .catch(error => {
        console.log(error);
    });
}
    axios.get('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/learning.json')
    .then(response => {
        //console.log(response.data);
        let word = [];
        for (let key in response.data) {
            word.push({w:response.data[key],index : key});
        }
       // console.log(response.data,id);
        res.render("learning", {words : word,id : id});
    })
    .catch(error => {
        console.log(error);
    });
});


app.get("/:id/home/review",(req,res) => {
    var id = req.params.id;
    var i = req.query.index;
    var name = req.query.name;
    var meaning = req.query.meaning;
    var mnemonic = req.query.mnemonic;
    var sentence = req.query.sentence;
    if(i !== undefined){
        axios.post('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/mastered.json',{
        name : name,
        meaning : meaning,
        mnemonic : mnemonic,
        sentence : sentence
    })
    axios.delete('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/reviewed/'+i+'.json')
    .then(response => {
        res.redirect('/'+ id + '/home/review') ;
    })
    .catch(error => {
        console.log(error);
    });
}
    //console.log(review);
    axios.get('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/reviewed.json')
    .then(response => {
        let word = [];
        //console.log(response.data);
        for (let key in response.data) {
            word.push({w:response.data[key],index : key});
        }
        //console.log(word);
        res.render("review", {words : word,id:id});
    })
    .catch(error => { 
        console.log(error);
    });
});


app.get("/:id/home/mastered",(req,res) => {
    var id = req.params.id;
    axios.get('https://vocabulary-app-d1420.firebaseio.com/'+ id + '/mastered.json')
    .then(response => {
        let word = [];
        for (let key in response.data) {
            word.push(response.data[key]);
        }
        res.render("mastered", {words : word,id:id});
    })
    .catch(error => {
        console.log(error);
    });
});

app.get("/login",(req,res) => {
    var id = null;
    res.render("login",{id : id});
});

app.get("/signup", (req,res) => {
    var id = null;
    res.render("signup",{id:id});
});



app.post("/login",(req,res) => {
    //console.log(req.body);
    var email = req.body.email;
    var password = req.body.psw;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response => {
        var id = response.user.uid;
        req.flash("safe","Hi! You have logged in again!!")
       // console.log(response);
        res.redirect("/"+id+"/home");
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorMessage);
        if (errorCode === 'auth/wrong-password') {
            req.flash("danger",errorMessage);
            res.redirect("/login");
          } else {
              req.flash("danger",errorMessage);
            res.redirect("/signup");
          }
      });
});

app.post("/signup", (req,res) => {
    var email = req.body.email;
    var password = req.body.psw;
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(response => {
       //console.log(response);
       var id = response.user.uid;
       req.flash("safe","Congratulations!!You have created your account successfully!!")
        res.redirect("/"+id+"/home");
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorMessage)
        req.flash("danger",errorMessage);
        res.redirect("/signup")
      });
});

app.get("/logout",(req,res) => {
    firebase.auth().signOut().then(function() {
        req.flash("safe","You have been logged out successfully!!");
        res.redirect("/");
      }).catch(function(error) {
        console.log(error);
      });
})



app.listen(8000,() => {
    console.log("Vocabulary-app is up and running on PORT : 8000");
});