const express = require('express')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.get('/register', async (req, res) => {
    try {
        res.render("web/register")
    } catch (error) {
        console.error(error)
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, number, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = [
            new User({
                name: name,
                email: email,
                number: number,
                password: hashedPassword,
            })
        ]

        newUser.forEach((data) => {
            data.save((error) => {
                if(error){
                    console.error(error)
                } else {
                    console.log(data)
                    res.redirect("/api/login")
                }
            })
        })
        
    } catch (error) {
        console.error(error)
    }
})

router.get("/login", async (req, res) => {
    try {
        res.render("web/login")
    } catch (error) {
        console.error(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const  { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user){
            const check = await bcrypt.compare(password, user.password)

            if(check){
                res.cookie("id", user.id)
                if(user.isAdmin == 1 || user.isAccept == 1){
                    res.redirect("/")
                } else if(user.isAccept == 0){
                    res.redirect("/api/pending")
                }
            } else {
                res.render("errors/password_error")
            }
        } else {
            res.render("errors/password_error")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("id")
        res.redirect("/api/login")
    } catch (error) {
        console.log(error)
    }
})


router.get("/pending", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAccept == 0){
            res.render("web/pending", {
                name: user.name,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router