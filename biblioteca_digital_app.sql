-- Criação da tabela `books Criar o banco de dados com o nome biblioteca_digital_sql`
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_livro VARCHAR(255) NOT NULL,
    nome_autor VARCHAR(255) NOT NULL,
    genero VARCHAR(100),
    editora VARCHAR(255),
    numero_paginas INT
);

-- Inserção de dados de exemplo
INSERT INTO books (nome_livro, nome_autor, genero, editora, numero_paginas) VALUES
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', 'HarperCollins', 1178),
('1984', 'George Orwell', 'Distopia', 'Companhia das Letras', 352),
('Dom Casmurro', 'Machado de Assis', 'Romance', 'Editora Globo', 224),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Fábula', 'Editora Agir', 96),
('A Revolução dos Bichos', 'George Orwell', 'Política', 'Companhia das Letras', 152);
