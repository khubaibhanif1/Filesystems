const express =  require("express");
const router=express.Router()

//file system

const  fs=require("fs")

//db path

const db = "./public/db/db.json"


const {onlyAdmin} = require("../middlewear/firstmiddlewear")

router.get("/read-db",onlyAdmin, (req, res) => {
    data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    res.json(data)
})
module.exports=router
































































































































































































































































































































































































































































































































































































































































































































































































































































































































































