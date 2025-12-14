import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"


const app = express()
// db conection
await connectDB()

// middleware
app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("Server is running ")
})


const PORT = process.env.PORT  || 3000 ;
app.listen(PORT , ()=> console.log(`server running on port ${PORT}`))