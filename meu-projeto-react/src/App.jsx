import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('produtos');

  // Estados de Produtos
  const [produtos, setProdutos] = useState([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');

  // Estados de Fornecedores
  const [fornecedores, setFornecedores] = useState([]);
  const [nomeFornecedor, setNomeFornecedor] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');

  // Estados de Associação
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');

  // Busca inicial de dados dentro do useEffect para evitar avisos do Linter
  useEffect(() => {
    let isMounted = true;

    const buscarDadosIniciais = async () => {
      try {
        const [resProd, resForn] = await Promise.all([
          axios.get(`${API_URL}/produtos`),
          axios.get(`${API_URL}/fornecedores`)
        ]);
        if (isMounted) {
          setProdutos(resProd.data);
          setFornecedores(resForn.data);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };

    buscarDadosIniciais();

    return () => {
      isMounted = false;
    };
  }, []);

  // Funções de recarga chamadas nos envios de formulário
  const recarregarProdutos = async () => {
    try {
      const res = await axios.get(`${API_URL}/produtos`);
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  const recarregarFornecedores = async () => {
    try {
      const res = await axios.get(`${API_URL}/fornecedores`);
      setFornecedores(res.data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  // Handlers de formulário
  const handleCadastrarProduto = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/produtos`, {
        nome: nomeProduto,
        descricao: descricaoProduto,
        preco: parseFloat(precoProduto),
        codigo_barras: codigoBarras,
      });
      alert('Produto cadastrado com sucesso!');
      setNomeProduto('');
      setDescricaoProduto('');
      setPrecoProduto('');
      setCodigoBarras('');
      recarregarProdutos();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto.');
    }
  };

  const handleCadastrarFornecedor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/fornecedores`, {
        nome: nomeFornecedor,
        cnpj,
        endereco,
        contato,
      });
      alert('Fornecedor cadastrado com sucesso!');
      setNomeFornecedor('');
      setCnpj('');
      setEndereco('');
      setContato('');
      recarregarFornecedores();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar fornecedor.');
    }
  };

  const handleAssociar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/produto-fornecedor`, {
        produto_id: produtoSelecionado,
        fornecedor_id: fornecedorSelecionado,
      });
      alert('Associação realizada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao associar produto e fornecedor.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>FACULDADE GRAN - Projeto Integrador</h2>
      <hr />

      {/* Menu de Abas */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setAbaAtiva('produtos')} style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: abaAtiva === 'produtos' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Produtos
        </button>
        <button onClick={() => setAbaAtiva('fornecedores')} style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: abaAtiva === 'fornecedores' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Fornecedores
        </button>
        <button onClick={() => setAbaAtiva('associacao')} style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: abaAtiva === 'associacao' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Associação
        </button>
      </div>

      {/* Aba de Produtos */}
      {abaAtiva === 'produtos' && (
        <div>
          <h3>Cadastro de Produto</h3>
          <form onSubmit={handleCadastrarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <input type="text" placeholder="Nome do Produto" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} required />
            <input type="text" placeholder="Descrição" value={descricaoProduto} onChange={(e) => setDescricaoProduto(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Preço" value={precoProduto} onChange={(e) => setPrecoProduto(e.target.value)} required />
            <input type="text" placeholder="Código de Barras" value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} required />
            <button type="submit" style={{ padding: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Cadastrar Produto</button>
          </form>

          <h3 style={{ marginTop: '30px' }}>Lista de Produtos</h3>
          <ul>
            {produtos.map((p) => (
              <li key={p.id}>{p.nome} - R$ {p.preco} (Cód: {p.codigo_barras})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Aba de Fornecedores */}
      {abaAtiva === 'fornecedores' && (
        <div>
          <h3>Cadastro de Fornecedor</h3>
          <form onSubmit={handleCadastrarFornecedor} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <input type="text" placeholder="Nome da Empresa" value={nomeFornecedor} onChange={(e) => setNomeFornecedor(e.target.value)} required />
            <input type="text" placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
            <input type="text" placeholder="Endereço Completo" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
            <input type="text" placeholder="Contato/Telefone" value={contato} onChange={(e) => setContato(e.target.value)} required />
            <button type="submit" style={{ padding: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Cadastrar Fornecedor</button>
          </form>

          <h3 style={{ marginTop: '30px' }}>Lista de Fornecedores</h3>
          <ul>
            {fornecedores.map((f) => (
              <li key={f.id}>{f.nome} - CNPJ: {f.cnpj} ({f.contato})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Aba de Associação */}
      {abaAtiva === 'associacao' && (
        <div>
          <h3>Associar Produto a Fornecedor</h3>
          <form onSubmit={handleAssociar} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <label>Selecione o Produto:</label>
            <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)} required>
              <option value="">-- Escolha um Produto --</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <label>Selecione o Fornecedor:</label>
            <select value={fornecedorSelecionado} onChange={(e) => setFornecedorSelecionado(e.target.value)} required>
              <option value="">-- Escolha um Fornecedor --</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>

            <button type="submit" style={{ padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>Salvar Associação</button>
          </form>
        </div>
      )}
    </div>
  );
}