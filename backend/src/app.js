import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import userRouter from './routes/userRoutes.js';
import eventRouter from './routes/eventRoutes.js';

const app = express()

const allowedOrigins = [
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use((express.static('public')))
app.use(cookieParser())

app.get('/', (req,res)=>{
    res.status(200).json({ status: 'OK', message: 'Server is running!' });
})

app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);

export {app}