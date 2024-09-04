const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'biblioteca_digital_sql',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

const allowedOrigins = [
  'http://localhost:8100', //dominio do Ionic Serve
  'http://10.0.2.2:8100', //iP do emulador Android para Ionic
  'http://127.0.0.1:8100', //local
  'http://10.0.2.2:8080'
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));


const apiRouter = express.Router();

apiRouter.get('/books/ExibirBiblioteca', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Livros exibidos:', results);
    res.json(results);
  });
});

apiRouter.get('/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Livro não encontrado' });
      return;
    }
    console.log('Livro encontrado:', results[0]);
    res.json(results[0]);
  });
});

apiRouter.post('/books/AdicionarLivro', (req, res) => {
  const { nome_livro, nome_autor, genero, editora, numero_paginas } = req.body;
  connection.query(
    'INSERT INTO books (nome_livro, nome_autor, genero, editora, numero_paginas) VALUES (?, ?, ?, ?, ?)',
    [nome_livro, nome_autor, genero, editora, numero_paginas],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newBook = { id: results.insertId, nome_livro, nome_autor, genero, editora, numero_paginas };
      console.log('Livro adicionado:', newBook);
      res.status(201).json(newBook);
    }
  );
});

apiRouter.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { nome_livro, nome_autor, genero, editora, numero_paginas } = req.body;
  connection.query(
    'UPDATE books SET nome_livro = ?, nome_autor = ?, genero = ?, editora = ?, numero_paginas = ? WHERE id = ?',
    [nome_livro, nome_autor, genero, editora, numero_paginas, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.log(`Livro com ID ${id} atualizado com sucesso`);
      res.json({ message: 'Livro atualizado com sucesso' });
    }
  );
});

apiRouter.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`Livro com ID ${id} deletado com sucesso`);
    res.json({ message: 'Livro deletado com sucesso' });
  });
});

app.use('/api', apiRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
