import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import userRouter from "./Routes/userRoutes.js"


const app = express()
// db conection
await connectDB()

// middleware
app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("Server is running ")
})
app.use("/api/users",userRouter)


const PORT = process.env.PORT  || 3000 ;
app.listen(PORT , ()=> console.log(`server running on port ${PORT}`))