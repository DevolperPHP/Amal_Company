const express = require("express");
const app = express();
const db = require("./config/database");
const bodyParser = require("body-parser");
const api = require("./routes/api")
const admin = require("./routes/admin")
const index = require("./routes/index")
const User = require("./models/User")
const Category = require("./models/Category")
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const Product = require("./models/Product");
const Bills = require("./models/bills");

const PORT = 80;

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/api", api)
app.use("/admin", admin);
app.use("/", index);

app.delete("/admin/category/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await Category.deleteOne({ _id: req.params.id })
                res.redirect("/admin/category/filter/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await Category.updateOne({ _id: req.params.id },
                    {
                        $set: {
                            name: req.body.name
                        }
                    })
                res.redirect("/admin/category/filter/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/product/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await Product.deleteOne({ _id: req.params.id })
                res.redirect("/admin/product/filter/all/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/product/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                const { name, des, price, cat } = req.body
                await Product.updateOne({ _id: req.params.id }, {
                    $set:{
                        name: name,
                        des: des,
                        price: price,
                        cat: cat,
                    }
                })
                res.redirect("/admin/product/filter/all/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/profiles/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.deleteOne({ _id: req.params.id })
                res.redirect("/admin/profiles")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/profiles/accept/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.updateOne({ _id: req.params.id}, {
                    $set:{
                        isAccept: 1,
                    }
                })
                res.redirect("/admin/profiles")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/profiles/admin/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.updateOne({ _id: req.params.id}, {
                    $set:{
                        isAdmin: 1,
                    }
                })
                res.redirect("/admin/profiles")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})


app.delete("/admin/profiles/worker/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.deleteOne({ _id: req.params.id })
                res.redirect("/admin/profiles/workers")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/profiles/admins/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.deleteOne({ _id: req.params.id })
                res.redirect("/admin/profiles/admins")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/profiles/unadmin/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await User.updateOne({ _id: req.params.id}, {
                    $set:{
                        isAdmin: 0,
                    }
                })
                res.redirect("/admin/profiles/admins")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/cart/add/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({name: req.params.name})

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                const {qty} = req.body
                await User.updateOne(
                    { _id: userID },
                    { $push: { cart: {name: product.name, price: product.price, qty: qty,} } }
                 )

                 await Product.updateOne({ name: req.params.name }, {
                     $set: {
                        score: product.score + Number(qty)
                     },
                     $push :{ scoreAnalysis: qty}
                 })
                res.redirect("/bill")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/cart/delete/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({name: req.params.name})

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                const {qty} = req.body
                await User.updateOne(
                    { _id: userID },
                    { $pull: { cart: {name: product.name, price: product.price, qty: qty,} } }
                 )
                 console.log(user.cart)
                res.redirect("/bill")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/cart/clear/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                await User.updateOne({ _id: req.params.id}, {
                    $set:{
                        cart: [],
                    }
                })
                res.redirect("/bill")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/product/outstock/:id", async(req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        isStock: 1,
                    }
                })
                res.redirect("/admin/product/filter/all/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/product/instock/:id", async(req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        isStock: 0,
                    }
                })
                res.redirect("/admin/product/filter/all/all")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/bill/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                await Bills.deleteOne({ _id: req.params.id })
                res.redirect("/admin/bills")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is running at ${PORT}`);
    }
})