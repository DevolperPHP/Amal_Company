const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const User = require('../models/User')
const Product = require('../models/Product')
const multer = require("multer")
const moment = require('moment')
const { getIndividualData , getLastMonthsData } = require("./data_analysis");
const e = require('express');
const Bills = require('../models/bills');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/upload/images");
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1000 * 1000,
    },
});

router.get("/category/filter/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        const filter = req.params.filter
        if (user) {
            if (user.isAdmin == 1) {
                if (filter == "all") {
                    const cat = await Category.find({}).sort({ Date: -1 })
                    res.render("web/admin/category", {
                        cat: cat,
                    })
                } else if (filter == "new") {
                    const cat = await Category.find({}).sort({ Date: -1 })
                    res.render("web/admin/category", {
                        cat: cat,
                    })
                } else if (filter == "old") {
                    const cat = await Category.find({}).sort({ Date: 1 })
                    res.render("web/admin/category", {
                        cat: cat,
                    })
                }

            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/category/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/add-category")
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.post("/category/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user) {
            if (user.isAdmin == 1) {
                const { name } = req.body
                const newCategory = [
                    new Category({
                        name: name,
                    })
                ]

                newCategory.forEach((data) => {
                    data.save((error) => {
                        if (error) {
                            console.log(errror)
                        } else {
                            console.log(data)
                            res.redirect("/admin/category/filter/all")
                        }
                    })
                })
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const cat = await Category.findOne({ _id: req.params.id })

        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/edit-category", {
                    cat: cat,
                })
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/product/all", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.find({}).sort({ Date: -1 })
        const cat = await Category.find({})

        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/products", {
                    product: product,
                    cat: cat,
                })
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/product/filter/:filter/:type", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const cat = await Category.find({})
        const cat_filter = req.params.filter
        const filterType = req.params.type

        if (user) {
            if (user.isAdmin == 1) {
                if (cat_filter == "all") {
                    if (filterType == "all") {
                        const product = await Product.find({}).sort({ Date: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "high") {
                        const product = await Product.find({}).sort({ price: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "low") {
                        const product = await Product.find({}).sort({ price: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "new") {
                        const product = await Product.find({}).sort({ Date: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "old") {
                        const product = await Product.find({}).sort({ Date: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "most") {
                        const product = await Product.find({}).sort({ score: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "little") {
                        const product = await Product.find({}).sort({ score: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    }
                } else {
                    if (filterType == "all") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ Date: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else
                    if (filterType == "high") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ price: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "low") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ price: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "new") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ Date: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "old") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ Date: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "most") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ score: -1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    } else if (filterType == "little") {
                        const product = await Product.find({ cat: req.params.filter }).sort({ score: 1 })
                        res.render("web/admin/products", {
                            product: product,
                            cat: cat,
                            cat_filter: cat_filter,
                            filterType: filterType,
                        })
                    }
                }
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/product/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const cat = await Category.find({})

        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/add-product", {
                    cat: cat,
                })
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

router.post("/product/add", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            if (user.isAdmin == 1) {
                const { name, des, price, cat } = req.body
                const newProduct = [
                    new Product({
                        name: name,
                        des: des,
                        price: price,
                        cat: cat,
                        Date: moment().format('l'),
                        analysis_date: moment().format("M/YYYY"),
                        image: req.file.filename,
                    })
                ]

                newProduct.forEach((data) => {
                    data.save((error) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(data)
                            res.redirect("/admin/product/filter/all/all")
                        }
                    })
                })
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

router.get("/product/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        const cat = await Category.find({})

        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/edit-product", {
                    product: product,
                    cat: cat,
                })
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

router.get("/product/info/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/product-info", {
                    product: product,
                })
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

router.get("/bills", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        const bills = await Bills.find({}).sort({Date: -1})
    
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/bills", {
                    product: product,
                    bills: bills
                })
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

router.get("/profiles", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const allUsers = await User.find({ isAccept: 0, isAdmin: 0 }).sort({ Date: -1 })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/profiles", {
                    allUsers : allUsers,
                })
            } else {
                res.render("errors/admin_error")
            }
        } else {
            res.render("errors/admin_error")
        }
    } catch (error){
        console.log(error)
    }
})

router.get("/profiles/workers", async(req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const allUsers = await User.find({ isAccept: 1, isAdmin: 0 }).sort({ Date: -1 })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/profiles-workers", {
                    allUsers : allUsers,
                })
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

router.get("/profiles/admins", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const allUsers = await User.find({ isAdmin: 1 }).sort({ Date: -1 })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/profiles-admins", {
                    allUsers : allUsers,
                })
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

router.get("/info/work/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const getUser = await User.findOne({ _id: req.params.id }).sort({ Date: -1 })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/work-info", {
                    data : getUser,
                })
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

router.get("/folders", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const getUser = await User.find({ isAccept: 1, isAdmin: 0 }).sort({ Date: -1 })
        if (user) {
            if (user.isAdmin == 1) {
                res.render("web/admin/folders", {
                    getUser : getUser,
                })
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

module.exports = router;