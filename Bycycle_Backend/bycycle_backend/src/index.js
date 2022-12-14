const express = require("express");
const bodyParser=require('body-Parser');

const app = express();
const dotenv = require("dotenv");
const db=require('./config/db.config').get('${process.env.NODE_ENV}');



const DB = require("./models");
const Role = DB.role;

const cors = require("cors");
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const mongoose= require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
    if(err){
        console.log(err)
    };
    console.log("database is connected");
    initial();
});

function initial() {
  console.log("this is ayesha")
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
    
  });
}







var corsOptions = {
  origin: "http://localhost:8081"
};

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bycycle application." });
});
// routes

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


