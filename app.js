const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Criando o banco de dados SQLite na memória
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Tabela de Produtos
  db.run(`CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nome TEXT, 
    descricao TEXT, 
    preco REAL, 
    codigo_barras TEXT
  )`);

  // Tabela de Fornecedores
  db.run(`CREATE TABLE fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nome TEXT, 
    cnpj TEXT, 
    endereco TEXT, 
    contato TEXT
  )`);

  // Tabela de Associação (Muitos para Muitos)
  db.run(`CREATE TABLE produto_fornecedor (
    produto_id INTEGER, 
    fornecedor_id INTEGER,
    PRIMARY KEY (produto_id, fornecedor_id)
  )`);

  // Inserindo dados de teste
  db.run(`INSERT INTO produtos (nome, descricao, preco, codigo_barras) VALUES ('Teclado', 'Teclado Mecânico USB', 150.0, '789123456')`);
  db.run(`INSERT INTO fornecedores (nome, cnpj, endereco, contato) VALUES ('Tech Distribuidora', '12.345.678/0001-90', 'Rua das Flores, 100', 'contato@tech.com')`);
  db.run(`INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (1, 1)`);
});

// --- 1. Rota de Produtos ---
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- 2. Rota de Fornecedores ---
app.get('/fornecedores', (req, res) => {
  db.all('SELECT * FROM fornecedores', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- 3. Rota de Associação ---
app.get('/associacoes', (req, res) => {
  const query = `
    SELECT p.nome AS produto, f.nome AS fornecedor 
    FROM produto_fornecedor pf
    JOIN produtos p ON p.id = pf.produto_id
    JOIN fornecedores f ON f.id = pf.fornecedor_id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});