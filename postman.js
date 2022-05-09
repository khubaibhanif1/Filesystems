const express =  require("express");
const app = express()
const bodyParser = require("body-parser")
const PORT = 3000
const logger = require("morgan");



const {onlyAdmin} = require("./middlewear/firstmiddlewear")

// File System
const fs = require("fs");
const res = require("express/lib/response");

// DB Path
const db = "./public/db/db.json"

// middlewares
app.use(bodyParser.json())
app.use(logger("dev"))
app.use(logger("common"))
app.use(logger("combined"))
app.use(logger("tiny"))
app.use(logger("short"))


const firstRouteFile=require("./routes/routes")
app.use("/home",firstRouteFile)

//ROUTES

app.get("/",(req,res)=>{
    res.send("welcome to home page")
})


//http://localhost:3500/read-db?admin=jakarta

app.get("/read-db",onlyAdmin, (req, res) => {
    data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    res.json(data)
})

app.get("/find-db/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    const name = req.params.name;

    founddata = data.find(user => {
        return user.name == name
    })

    console.log(typeof founddata);

    res.json( typeof founddata !== "undefined" ? founddata : "User not found")
})


//delete user data from json data

app.get('/delete/:name',( req,res)=>{
    data = JSON.parse(fs.readFileSync(db, "utf-8",{flags : "a"})) 
    del=data.findIndex(y=>y.name===req.params.name)
    console.log(del)
    data.splice(del,1)
    fs.writeFileSync(db,JSON.stringify(data))

if (del==-1){ 
    res.send("removed")
}
else if(del>1){
    data.splice(del,1)
    res.send("already deleted")
}
})


// filter data route .

app.get("/filter-user/:pass", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8")) 
    const pass = req.params.pass;
    filterdata= data.filter(password=>{
        if(password.pass==pass)
        return password.name
    })
    res.json(filterdata)
})      
   


//manually add user in database
// app.get("/newuser/:name", (req, res) => {
//     let data = JSON.parse(fs.readFileSync(db, "utf-8"))   
//     let newdata={
//         "name": "kamran",
//         "pass":"43210"
//     } 
//     data.push(newdata)
//     var newData2 = JSON.stringify(data);
//     fs.writeFile(db, newData2, (err) => {
  
//     if (err) throw err;
//   console.log("New data added");
// })
// })


    // let newuser1 = data.find(users => {
    //     if(users==name){
    //         res.send("already exist")

    //     }
    //     else if(users!==name){
    //         data.push(newuser1)
    //         res.send("new user data added")
    //         fs.writeFileSync(db,JSON.stringify(data))
    //     }
    // })

    // })
    
    
 //another newuser  add data pending    
app.get("/newuser/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))
    abc = data.find(x => {
        return x.name == req.params.name
        })
        
        if(abc !== "undefined"){
            res.send("USER ALREADY EXIST")  
        }
        else {
        newname=req.query.name
        newpass=req.query.pass
        data.push({
            "name":newname,
            "pass":newpass
        })
        
    }
    fs.writeFileSync(db , JSON.stringify(data))
    res.send("New data added in database")
       
    })
   
    




//find data if user exist or not then,  add New User in database. 
// app.get('/update/:name', (req, res) => {
//     let data = JSON.parse(fs.readFileSync(db, "utf-8"))
//     named=req.params.name
//         username= data.find(users => {
//       users.name== named
//     })
//     if (username !== 'undefined'){
//     res.send('User already Exist')
//   }
//   else if (username == 'undefined'){
//     res.send('User not Exist')
// }
//     else{
//     newuser = {name: req.query.name , pass: req.query.pass}
//     data.push(newuser)
//     res.send('New User Added')
// }
//   fs.writeFileSync(db, JSON.stringify(data))
//   })



app.get("/update-user/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))  
    updatedData = []

    // searching user
    data.forEach((user, i) => {
        if (user.name == req.params.name){
            updatedData = [user, i]
            return true
        } 
    })

    // validating user found or not
    if(updatedData.length > 0){

        console.log("updatedData");
        console.log(updatedData);
        

        // now updating user name if required
        if(typeof req.query.n !== "undefined"){
            data[updatedData[1]].name = req.query.n
        }
        
        // now updating user password if required
        if(typeof req.query.p !== "undefined"){
            data[updatedData[1]].pass = req.query.p
        }

        fs.writeFileSync(db, JSON.stringify(data));

    }

    res.json(updatedData.length > 0 ? {msg: "Data updated", data: updatedData[0] } : "User not found")
})


app.listen(PORT, () => {
    console.log("Server is running at port: " + PORT);
})