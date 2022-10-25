import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import * as auth from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());

// capturar body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.q5tii08.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
    .connect(uri, options)
    .then(() => console.log("Base de datos conectada"))
    .catch((e) => console.log("error db:", e));

// import routes

// route middlewares
// app.use("/api/dashboard", verifyToken, dashboadRoutes);
app.use("/api/user", auth);
app.get("/", (req, res) => {
    res.json({
        estado: true,
        mensaje: "funciona!",
    });
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`);
});
