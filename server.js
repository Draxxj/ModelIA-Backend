const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(express.json());


// Permitir que o site converse com o backend

app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if(req.method === "OPTIONS"){

        return res.sendStatus(200);

    }

    next();

});


// ==========================================
// SERVIR O SITE
// ==========================================

app.use(
    express.static(
        path.join(__dirname)
    )
);


// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});


// ==========================================
// GERAR MODELO
// ==========================================

app.post(
    "/api/generate",
    (req, res) => {

        const descricao =
            req.body.descricao;


        if(!descricao){

            return res.status(400).json({

                sucesso:false,

                mensagem:
                "Nenhuma descrição foi enviada."

            });

        }


        console.log(
            "Descrição recebida:",
            descricao
        );


        res.json({

            sucesso:true,

            mensagem:
            "Descrição recebida pelo ModelIA!",

            resultado:
            "Modelo solicitado: " +
            descricao

        });

    }
);


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `ModelIA rodando na porta ${PORT}`
        );

    }
);
