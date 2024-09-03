const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'biblioteca_digital_app',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

const apiRouter = express.Router();

apiRouter.get('/books/ExibirBiblioteca', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
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
      res.status(201).json({ id: results.insertId, nome_livro, nome_autor, genero, editora, numero_paginas });
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
    res.json({ message: 'Livro deletado com sucesso' });
  });
});

app.use('/api', apiRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
