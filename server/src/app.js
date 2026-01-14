import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route.js'
import routerPost from "./routes/post.route.js";
import DiagnosisRouter from "./routes/diagnosis.route.js";

const app = express();

// --- PRODUCTION-READY CORS SETUP ---
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Helpful for debugging
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie", "Content-Type", "Content-Disposition"] // Allow frontend to read cookies if needed
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle Preflight requests explicitly (Critical for some browsers)
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"))

// import routes

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/diagnosis",DiagnosisRouter)
app.use('/post', routerPost);

export { app };
