const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Permite receber JSON
app.use(express.json());

// Permite que o HTML do ModelIA converse com o backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});


// ==========================================
// TESTE DO SERVIDOR
// ==========================================

app.get("/", (req, res) => {
    res.send("ModelIA online Backend");
});


// ==========================================
// GERAR MODELO
// ==========================================

app.post("/api/generate", (req, res) => {

    const descricao = req.body.descricao;

    if (!descricao) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Nenhuma descrição foi enviada."
        });
    }

    console.log("Descrição recebida:", descricao);

    // Resposta temporária
    // Aqui futuramente vamos conectar a IA
    // que realmente irá gerar o modelo 3D.

    res.json({
        sucesso: true,
        mensagem: "Descrição recebida pelo ModelIA!",
        resultado: `Modelo solicitado: ${descricao}`
    });

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`ModelIA rodando na porta ${PORT}`);
});
