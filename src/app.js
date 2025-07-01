import express from 'express';
// import bodyParser from 'body-parser' -> old express js , cannot i package
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Replace this with the exact URL of your frontend
    credentials: true, // Allow cookies to be sent
  }));






// routes import 
import userRout from './routes/user.routes.js';
import adminRout from './routes/admin.routes.js';
import { earringDataRouter, ringDataRouter, pendantDataRouter, mangalsutraDataRouter, bangleDataRouter, chainDataRouter, reviewRouter } from './routes/products.routes.js';
import Metalrouter from './routes/publicRoutes.routes.js';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';








app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes Declaration
app.use('/api/v1/users', userRout);
app.use('/api/v1/admins', adminRout);
app.use("/api/v1/products", earringDataRouter); 
app.use("/api/v1/products", ringDataRouter); 
app.use("/api/v1/products", pendantDataRouter); 
app.use("/api/v1/products", mangalsutraDataRouter);
app.use("/api/v1/products", bangleDataRouter);
app.use("/api/v1/products", chainDataRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/metal_prise", Metalrouter);


// routes declaration
// app.use("/api/v1/users", userRout)
// app.use("/api/v1/admins", adminRout)

export { app }