import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route.js'
import routerPost from "./routes/post.route.js";
import DiagnosisRouter from "./routes/diagnosis.route.js";

const app = express();

// { origin: process.env.CORS_ORIGIN, credentials: true }
app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"))

// import routes

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/diagnosis",DiagnosisRouter)
app.use("/post",routerPost)

export { app };
