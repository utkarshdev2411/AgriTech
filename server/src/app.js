import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// { origin: process.env.CORS_ORIGIN, credentials: true }
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import routes
import userRouter from './routes/user.route.js'

// routes declaration
app.use("/api/v1/users", userRouter)

export { app };
