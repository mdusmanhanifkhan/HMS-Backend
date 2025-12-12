import 'dotenv/config'

import express from "express"
import routes from "./routes/index.js"
import cors from "cors"
const app = express()

const port = process.env.PORT;

app.use(cors({
  origin: [
    "https://hikarimed.online",
    "https://www.hikarimed.online",
    "http://localhost:5173",
    "https://hms-frontend-alpha.vercel.app"  
  ],
  credentials: true, 
}))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)

app.get("/",(req,res)=>{
    return res.send("hello world!")
})

app.listen(port, ()=>(
    console.log(`server is running on this port ${port} `)
))