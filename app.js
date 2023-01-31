const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const alert = require('alert');

require('dotenv').config()
mongoose.set('strictQuery', true);

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://Dhruv-admin:" + process.env.MONGO_DB_PASS + "@cluster0.gtzmx2u.mongodb.net/formDB")

const regSchema = new mongoose.Schema({
    Fname: String,
    Lname: String,
    email: String,
    password: String,
})

const Data = mongoose.model('Data', regSchema);

app.get("/", (req, res) => {
    res.render("login")
})

app.post("/", (req, res) => {
    const loginId = req.body.login;
    const pass = req.body.pass;



    Data.findOne({ email: loginId }, (err, userData) => {
        
        if(err){
            console.log(err)
            alert("try again");
            res.redirect("/");
        }

        if (userData) {
            if (userData.password == pass) {
                res.render("successful")
            }

            else {
                alert("try again");
                res.redirect("/");
            }
        }

        else {
            alert("try again");
            res.redirect("/");
        }


    })
})

app.get("/registration", (req, res) => {
    res.render("registration")
})

app.post("/registration", (req, res) => {
    if (req.body.password === req.body.Rpassword) {
        const data = new Data({
            Fname: req.body.Fname,
            Lname: req.body.Lname,
            email: req.body.email,
            password: req.body.password
        })

        data.save();

        res.redirect("/")
    }

    else {
        alert("password and Repeat Password dont match");
        res.render("registration")
    }
})

app.listen("3000", (req, res) => {
    console.log("server is running at 3000");
})