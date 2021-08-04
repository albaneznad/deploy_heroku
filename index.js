const express = require("express");
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

const lista = [
    {
        id: 1,
        nome: "Os Goonies",
        id: 2,
        nome: "Pateta",
    },
];

app.get("/", function (req, res) {
    res.send("Teste");
});

app.get("/filmes", function (req, res) {
    res.send(lista.filter(Boolean));
});


app.post("/filmes", (req, res) => {
    const filme = req.body.nome;

    lista.push(filme);

    res.status(201).send("Filme inserido com sucesso!");
});

app.put("/filmes/:id", (req, res) => {
    const id = +req.params.id;

    const novoFilme = req.body.nome;

    lista[id] = novoFilme;

    res.send("Filme atualizado com sucesso!");
});

app.delete("/filmes/:id", (req, res) => {
    const id = +req.params.id;

    delete lista[id];

    res.send("Filme excluído com sucesso!");
});

app.listen(port, () => {
    console.log("Aplicação rodando em http://localhost:3000/");
});
