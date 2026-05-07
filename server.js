const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚗");
});

app.listen(3000, () => {
    console.log("Servidor iniciado en:");
    console.log("http://localhost:3000");
});