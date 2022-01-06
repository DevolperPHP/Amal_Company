const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Product = require("../models/Product")
const Category = require("../models/Category")
const Bills = require("../models/bills")
const moment = require("moment")

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.find({}).sort({ Date: -1 })
        const productName = await Product.find({}, { _id: 0, name: 1 })
        const cat = await Category.find({}).sort({ Date: -1 })

        function getValue(item) {
            return [item.name].join()
        }

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/index", {
                    user: user,
                    product: product,
                    productName: productName.map(getValue),
                    cat: cat,
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/cat/:cat", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.find({ cat: req.params.cat }).sort({ Date: -1 })
        const productName = await Product.find({}, { _id: 0, name: 1 })
        const cat = await Category.find({}).sort({ Date: -1 })

        function getValue(item) {
            return [item.name].join()
        }

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/index", {
                    user: user,
                    product: product,
                    productName: productName.map(getValue),
                    cat: cat,
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.error(error)
    }
})


router.get("/getproduct/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const getProductName = req.params.name
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ name: getProductName }).sort({ Date: -1 })

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/get-product", {
                    user: user,
                    product: product,
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/bill", async (req, res) => {
    try {
        const userID = req.cookies.id
        const getProductName = req.params.name
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ name: getProductName }).sort({ Date: -1 })
        const dataName = user.cart.map(x => x.name)
        const dataPrice = user.cart.map(x => x.price)
        const dataQty = user.cart.map(x => x.qty)
        const productName = await Product.find({ isStock: 0 }, { _id: 0, name: 1 })

        function getValue(item) {
            return [item.name].join()
        }

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/bill", {
                    user: user,
                    product: product,
                    dataName: dataName,
                    dataPrice: dataPrice,
                    dataQty: dataQty,
                    productName: productName.map(getValue),
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {

    }
})

router.post("/bill/done", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        function getValue(item) {
            return [item.name].join()
        }

        function getScore(item){
            return [item.qty].join()
        }

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                const { name, total_price, qty_total } = req.body
                await User.updateOne({ _id: userID }, {
                    $push: {
                        beenSold: user.cart.map(getValue),
                        soldScore: user.cart.map(getScore)
                    },

                    $set: {
                        score: user.score + Number(qty_total)
                    }
                })


                const newBill = [
                    new Bills({
                        name: name,
                        total: total_price,
                        cart: user.cart,
                        Date: moment().format("l"),
                        seller: user.name,
                        seller_id: user._id
                    })
                ]

                newBill.forEach((data) => {
                    data.save((error) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(data)
                            res.redirect("/bill")
                        }
                    })
                })

                await User.updateOne({ _id: userID }, {
                    $set: {
                        cart: []
                    }
                })

            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/bills", async (req, res) => {
    try {
        const userID = req.cookies.id
        const getProductName = req.params.name
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ name: getProductName }).sort({ Date: -1 })
        const bills = await Bills.find({ seller_id: userID }).sort({ Date: -1 })

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/bills", {
                    user: user,
                    product: product,
                    bills: bills,
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/bills/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const getProductName = req.params.name
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ name: getProductName }).sort({ Date: -1 })
        const bills = await Bills.findOne({ _id: req.params.id })
        const dataName = bills.cart.map(x => x.name)
        const dataPrice = bills.cart.map(x => x.price)
        const dataQty = bills.cart.map(x => x.qty)

        function getValue(item) {
            return [item.name].join()
        }

        console.log(dataName)

        if (user) {
            if (user.isAdmin == 1 || user.isAccept == 1) {
                res.render("web/user/bill-get", {
                    user: user,
                    product: product,
                    data: bills,
                    dataName: dataName,
                    dataPrice: dataPrice,
                    dataQty: dataQty,
                })
            } else {
                res.redirect("/api/pending")
            }
        } else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router