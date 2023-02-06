const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");


require('dotenv').config()
mongoose.set('strictQuery', true);

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');


mongoose.connect(process.env.MONGO_DB_URL  , ()=>{
    console.log("db is connected");
})

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
            res.render("js")
        }

        if (userData) {
            if (userData.password == pass) {
                res.render("successful")
            }

            else {
             
                res.render('login', {message: "Password is wrong"})
            }
        }

        else {
            
            res.render('login', {message: "Email or Password is wrong"})
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
        
        res.render('registration', {message: "Both Password is not matching"})
    }
})

app.post("/js" , (req , res) => {
    res.render("/login")
})

app.listen("3000", (req, res) => {
    console.log("server is running at 3000");
})