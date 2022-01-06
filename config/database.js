const mongoose = require('mongoose')
const MONGO_URI = "mongodb://localhost:27017/amal_company"

mongoose.connect(MONGO_URI, (err, connect) => {
    if(connect) {
        console.log("Data base connected")
    } else {
        console.log(err)
    }
})