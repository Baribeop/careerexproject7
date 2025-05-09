
// Item model

const mongoose = require("mongoose")

const ItemsSchema = new mongoose.Schema({

    itemName: {type: String, require:true},
    description :{type: String, require: true},
    locationFound :{type: String, require:true},
    dateFound : { type: Date, 
        default : Date.now},
    claimed : {type: Boolean, default: false}
})

const Items = new mongoose.model("Items", ItemsSchema)


module.exports = Items