const express = require('express');

const bodyParser = require('body-parser');

const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

(async () => {

// const connectionString = 'mongodb://localhost:27017/deploy_heroku';
const connectionString = 'mongodb+srv://admin:sorvete2211@cluster0.00ybv.mongodb.net/HEROKU_DB_CLOUD?retryWrites=true&w=majority';

console.info('Conectando ao MongoDB...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/ola', (req, res) => {
  res.send('Olá Mundo');
});

const db = client.db('heroku_db_cloud');
const mensagens = db.collection('mensagens');

const getMensagensValidas = () => mensagens.find({}).toArray();

const getMensagemById = async id => mensagens.findOne({ _id: ObjectId(id) });

app.get('/mensagens', async (req, res) => {
    res.send(await getMensagensValidas());
});

//get
app.get('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const mensagem = await getMensagemById(id);

    if (!mensagem) {
        res.send('Mensagem não encontrada.');

        return;
    }

    res.send(mensagem);
});

//post
app.post('/mensagens', async (req, res) => {
    const mensagem = req.body;

    if (!mensagem
        || !mensagem.texto
        || !mensagem.usuario) {
        res.send('Mensagem inválida.');

        return;
    }

    const { insertedCount } = await mensagens.insertOne(mensagem);

    if (insertedCount !== 1) {
        res.send('Erro ao criar a mensagem.');

        return;
    }

    res.send(mensagem);
});

//put
app.put('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const novaMensagem = req.body;

    if (!novaMensagem
        || !novaMensagem.texto
        || !novaMensagem.usuario) {
        res.send('Mensagem inválida.');

        return;
    }

    const quantidade_mensagens = await mensagens.countDocuments({ _id: ObjectId(id) });

    if (quantidade_mensagens !== 1) {
        res.send('Mensagem não encontrada');

        return;
    }

    const { result } = await mensagens.updateOne(
        {
            _id: ObjectId(id)
        },
        {
            $set: novaMensagem
        }
    );

    if (result.ok !== 1) {
        res.send('Erro ao atualizar a mensagem.');

        return;
    }

    res.send(await getMensagemById(id));
});

// del_id
app.delete('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const quantidade_mensagens = await mensagens.countDocuments({ _id: ObjectId(id) });

    if (quantidade_mensagens !== 1) {
        res.send('Mensagem não encontrada.');

        return;
    }
    
    const { deletedCount } = await mensagens.deleteOne({ _id: ObjectId(id) });

    if (deletedCount !== 1) {
        res.send('Ocorreu um erro ao remover a mensagem.');

        return;
    }

    res.send('Mensagem removida com sucesso.');
});

app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`);
});

})();