// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// import FormularioLancamento from './components/FormularioLancamento';
// import DeletarLancamento from './components/DeletarLancamento';

// const URL = 'http://localhost:3901';
const URL = '/api-gestor';

//  LOCALHOST
/*
const api = axios.create({
  baseURL: 'http://localhost:3901',
});
*/

// PRODUÇÃO
const api = axios.create({
  baseURL: '/api-gestor',
});

function App() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [dataPesquisa, setDataPesquisa] = useState(new Date().toISOString().split('T')[0]);

  const buscarFrequencia = async () => {
    try {      
      const response = await fetch(URL+'/chamaviva/pessoa/'+dataPesquisa);
      const resultado = await response.json()
      
      setDados(resultado);
      setLoading(false);
    } catch (error) {
      setErro('Erro ao carregar os dados: ' + error.message);
      setLoading(false);
    }
  };
  
  function HandleCheckbox({obj}) {
    let check = false;

    async function handleClick(e) {
      // função para salvar
      // retornar o obj

      let dataHoje = new Date().toISOString().split('T')[0];
      let novoEstado = false;
      if(obj.PRESENTE === 0) {
        novoEstado = true
      }

      if (novoEstado === true) {
        // --- ADICIONAR PRESENÇA (POST) ---
        await fetch(`${URL}/chamaviva/frequencias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idPessoa: obj.ID_PESSOA,
            dataMarcada: dataHoje
          })
        });
      } else {
        // --- REMOVER PRESENÇA (DELETE) ---
        // Ajuste a rota conforme seu backend espera receber
        await fetch(`${URL}/chamaviva/frequencias/${obj.PRESENTE}`, {
          method: 'DELETE'
        });
      }

      buscarFrequencia();
    }

    if(obj.PRESENTE > 0) {
      check = true;
    }
    
    return (
    // <input checked={check} type="checkbox" onClick={handleClick}/>
    <label className="switch">
      <input 
        type="checkbox" 
        checked={check}         
        onClick={handleClick}
      />
      <span className="slider"></span>
    </label>
    );    
  }

  useEffect(() => {
    buscarFrequencia();
  }, []);

  if (loading) return <div className="loading">Carregando dados...</div>;
  if (erro) return <div className="error">{erro}</div>;

  return (
    <div className="container">
      <h2>Gestor de Frequência</h2>
      
      <div className='p-row'>
        <div className='p-col-6'>
          <input 
            className='data-input'
            id='dataPesquisa'
            type='date'
            onChange={(e) => setDataPesquisa(e.target.value)}/>
        </div>    
        <div className='p-col-6'>
          <button onClick={buscarFrequencia} className="btn-atualizar">
            Buscar
          </button>
        </div>
      </div>

      {dados.length === 0 ? (
        <p>Nenhum dado encontrado.</p>
      ) : (
        <table className="tabela-frequencia">
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Nome</th>
              <th>Presente?</th>
              {/* <th>Presente?</th> */}
            </tr>
          </thead>
          <tbody>
            {dados.map((linha) => (
              <tr>
                {/* <td>{linha.FOTO}</td> */}
                <td>{linha.NOME}</td>
                <td>
                  <HandleCheckbox 
                    obj={linha}
                    onToggle={() => handleClick(e)}/>
                </td>
                {/* <td>{linha.PRESENTE}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
}

export default App;