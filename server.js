const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

const TRIPO_URL =
    "https://api.tripo3d.ai/v2/openapi";


// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(express.json());


// Permitir comunicação com o site

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

    if (req.method === "OPTIONS") {
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
// TESTE DO BACKEND
// ==========================================

app.get("/api/status", (req, res) => {

    res.json({

        online: true,

        tripo_configurado:
            Boolean(TRIPO_API_KEY),

        mensagem:
            "ModelIA Backend funcionando"

    });

});


// ==========================================
// GERAR MODELO 3D
// ==========================================

app.post(
    "/api/generate",
    async (req, res) => {

        try {

            // Verificar API Key

            if (!TRIPO_API_KEY) {

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "TRIPO_API_KEY não está configurada no Render."

                });

            }


            // Pegar descrição

            const descricao =
                req.body.descricao;


            if (
                !descricao ||
                typeof descricao !== "string"
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Digite uma descrição para o modelo."

                });

            }


            // Limitar tamanho

            const prompt =
                descricao
                    .trim()
                    .slice(0, 1024);


            if (!prompt) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "A descrição está vazia."

                });

            }


            console.log(
                "Gerando modelo:",
                prompt
            );


            // ======================================
            // PEDIR AO TRIPO PARA GERAR O MODELO
            // ======================================

            const resposta =
                await fetch(
                    TRIPO_URL + "/task",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                TRIPO_API_KEY

                        },

                        body: JSON.stringify({

                            type:
                                "text_to_model",

                            prompt:
                                prompt,

                            model_version:
                                "P1-20260311",

                            texture:
                                true

                        })

                    }
                );


            const dados =
                await resposta.json();


            console.log(
                "Resposta do Tripo:",
                dados
            );


            if (
                !resposta.ok ||
                dados.code !== 0
            ) {

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        dados.message ||
                        "O Tripo recusou a geração."

                });

            }


            const taskId =
                dados.data?.task_id;


            if (!taskId) {

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "O Tripo não retornou um task_id."

                });

            }


            // ======================================
            // RESPONDE IMEDIATAMENTE
            // ======================================

            res.json({

                sucesso: true,

                mensagem:
                    "Modelo enviado para geração.",

                task_id:
                    taskId,

                status:
                    "queued"

            });

        }

        catch (erro) {

            console.error(
                "Erro ao gerar modelo:",
                erro
            );

            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro interno ao conectar com o Tripo."

            });

        }

    }
);


// ==========================================
// CONSULTAR STATUS DO MODELO
// ==========================================

app.get(
    "/api/task/:taskId",
    async (req, res) => {

        try {

            if (!TRIPO_API_KEY) {

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "TRIPO_API_KEY não configurada."

                });

            }


            const taskId =
                req.params.taskId;


            const resposta =
                await fetch(
                    TRIPO_URL +
                    "/task/" +
                    encodeURIComponent(taskId),

                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                TRIPO_API_KEY

                        }

                    }
                );


            const dados =
                await resposta.json();


            console.log(
                "Status da tarefa:",
                dados
            );


            if (
                !resposta.ok ||
                dados.code !== 0
            ) {

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        dados.message ||
                        "Não foi possível consultar a tarefa."

                });

            }


            const tarefa =
                dados.data;


            res.json({

                sucesso: true,

                task_id:
                    tarefa.task_id,

                status:
                    tarefa.status,

                progress:
                    tarefa.progress || 0,

                output:
                    tarefa.output || {}

            });

        }

        catch (erro) {

            console.error(
                "Erro ao consultar tarefa:",
                erro
            );

            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao consultar o modelo."

            });

        }

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
