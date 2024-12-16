import express from 'express';
// import bodyParser from 'body-parser' -> old express js , cannot i package
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Replace this with the exact URL of your frontend
    credentials: true, // Allow cookies to be sent
  }));






// routes import 
import userRout from './routes/user.routes.js';
import adminRout from './routes/admin.routes.js';







app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes Declaration
app.use('/api/v1/users', userRout);
app.use('/api/v1/admins', adminRout);


// routes declaration
// app.use("/api/v1/users", userRout)
// app.use("/api/v1/admins", adminRout)

export { app }