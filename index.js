// Server setup and import required module and dependencies

const express = require("express")
require('dotenv').config()

const {mongoose} = require("mongoose")

const Items = require("./itemsModel")

const app = express()

app.use(express.json())

MONGODB_URL = process.env.MONGODB_URL
PORT = process.env.PORT || 9000

mongoose.connect(MONGODB_URL)

.then(() => {
    console.log("Mongoose conncted")
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)
})

})


// Implement CRUD operations:

// all items for testing

app.get("/all-found-items", async (req, res) => {

    const allFoundItems = await Items.find()

    res.status(200).json({  
        message: "Success",
        allFoundItems
    })
})

// Add a found item

app.post("/add-lost-item", async (req, res) =>{


    const { itemName, description, locationFound, dateFound, claimed } = req.body

    if (!itemName || !description || !locationFound ) {
        
        return res.status(400).json("Enter missing detail(s)")
    }

    let formatedDate = undefined

    if (dateFound){
        formatedDate = new Date(dateFound)
    } 

    const newLostAndFoundItem =  new Items({ 
        itemName, 
        description, 
        locationFound, 
        dateFound :formatedDate, 
        claimed })

    await newLostAndFoundItem.save()

    res.status(200).json({
        message: "Item added succesfully",
        newLostAndFoundItem  
    })

 })


// View all unclaimed items

app.get("/all-unclaimed-items", async (req, res) => {

    const allItems = await Items.find()

    const unClaimedItems = allItems.filter((each) => {
       {
            return each.claimed == false
        }
    })
    res.status(200).json({
        message : "success",
        unClaimedItems
    })
})


// View one item by ID

app.get("/one-item-by-id/:id", async (req, res) => {

    const {id} = req.params

    const item = await Items.findById(id)

    if (!item){
        return res.status(404).json({
            message: `Item with id: ${id} not found`
        })
    } else {
        res.status(200).json({
            message: "success",
            item
        })
    }

    
})



// Update an item’s details or mark as claimed

app.patch("/update-item/:id", async (req, res) => {

    const {claimed } = req.body

    const {id} = req.params

    const existingItem = await Items.findById(id)

    if (existingItem) {
        
        existingItem.clamed = claimed

        await existingItem.save()

        res.status(200).json( 
            {
            message : "Item successfully updated"
        })
    } else {

        res.status(401).json({
            message : "Item not found"
        })
    }

}  )


// Delete old/irrelevant entries
app.delete("/delete-item/:id",  async (req, res)  =>{
    const { id } = req.params

    deletedItem = await Items.findByIdAndDelete(id)

    res.status(200).json({
        message : "Item deleted succesfully"
    })
})

