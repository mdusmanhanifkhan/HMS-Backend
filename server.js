import 'dotenv/config'

import express from "express"
import routes from "./routes/index.js"
import cors from "cors"
const app = express()

const port = process.env.PORT;
const FRONTEND_SERVICE_ORIGIN = process.env.CORE_ORIGIN_FRONTEND; 
const APP_BASE_URL = process.env.APP_BASE_URL;
const APP_BASE_URL_WWW = process.env.APP_BASE_URL_WWW;

const allowedOrigins = [
  "https://hikarimed.online",
  "https://www.hikarimed.online",
  "https://hikarimed.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)

app.get("/",(req,res)=>{
    return res.send("Welcome to Hikari Med Online")
})

app.listen(port, ()=>(
    console.log(`server is running on this port ${port} `)
))
