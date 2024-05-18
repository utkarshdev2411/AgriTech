import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route.js'
import DiagnosisRouter from "./routes/diagnosis.route.js";

const app = express();

// { origin: process.env.CORS_ORIGIN, credentials: true }
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import routes

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/diagnosis",DiagnosisRouter)

export { app };
