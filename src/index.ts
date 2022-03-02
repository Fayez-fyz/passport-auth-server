import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
// import flash from "connect-flash";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
dotenv.config();
// require('./helpers/passport')
require("./helpers/passportAuth")(passport);

const app: express.Application = express();
const authRoutes = require("./routes/auth");

app.use(
  cors({
    origin: "http://localhost:3000",

    credentials: true,
  })
);

//Connect to MongoDB
mongoose
  .connect(process.env.DB)
  .then(() => console.log("DB IS CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: true,
    store: new mongoStore({
      mongoUrl: process.env.DB,
      collectionName: "sessions",
    }),
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);

const port: number = parseInt(process.env.PORT || "5000", 10);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
