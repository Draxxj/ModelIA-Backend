const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ModelIA Backend Online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor iniciado");
});
