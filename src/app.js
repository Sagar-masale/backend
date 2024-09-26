import express from 'express';
// import bodyParser from 'body-parser' -> old express js , cannot i package
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))






// routes import 
import userRout from './routes/user.routes.js';





app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes declaration
app.use("/api/v1/users", userRout)

export { app }