const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.q5tii08.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
    .connect(uri, options)
    .then(() => console.log("Base de datos conectada"))
    .catch((e) => console.log("error db:", e));

// import routes
const authRoutes = require("./routes/auth");
const instrumentRoutes = require("./routes/instruments");
const proyectRoutes = require("./routes/proyects");
const studentRoutes = require("./routes/students");
const schoolRoutes = require("./routes/schools");

const dashboadRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");

// route middlewares
app.use("/api/dashboard", verifyToken, dashboadRoutes);
app.use("/api/user", authRoutes);
app.use("/api/instrument", instrumentRoutes);
app.use("/api/proyect", proyectRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/school", schoolRoutes);

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
