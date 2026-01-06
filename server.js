import 'dotenv/config'

import express from "express"
import routes from "./routes/index.js"
import cors from "cors"
const app = express()

const port = process.env.PORT;
const FRONTEND_SERVICE_ORIGIN = process.env.CORE_ORIGIN_FRONTEND; 
const APP_BASE_URL = process.env.APP_BASE_URL;
const APP_BASE_URL_WWW = process.env.APP_BASE_URL_WWW;

app.use(cors({
  origin: [
  origin: true,
  credentials: true, 
}))
i
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)

app.get("/",(req,res)=>{
    return res.send("Welcome to Hikari Med Online")
})

app.listen(port, ()=>(
    console.log(`server is running on this port ${port} `)
))
