const db = require('../config/db'); // Importando nosso pool de conexões

exports.teste = async (req, res) => {
  try {
    console.log("ENTROU");
    const [frequencias] = await db.query('SELECT * FROM FREQUENCIA ');
    res.status(200).json(frequencias);
  } catch (error) {
    console.error('Erro ao listar FREQUENCIA:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FREQUENCIA

// Função para LISTAR todos os frequencias
exports.listarFrequenciasDia = async (req, res) => {
  const { data } = req.body; 
  
  try {
    const sql = 'SELECT * FROM FREQUENCIA WHERE DATE(`DATA_MARCADA`) = ? ';
    const [frequencias] = await db.query(sql, [data]);
    res.status(200).json(frequencias);
  } catch (error) {
    console.error('Erro ao listar frequencias:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para CRIAR um novo frequencia
exports.criarFrequencia = async (req, res) => {
  // Pega os dados do corpo da requisição
  const { idPessoa, dataMarcada } = req.body;

  // Validação simples para garantir que todos os campos foram enviados
  if (!idPessoa || !dataMarcada ) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // A '?' previne SQL Injection. Os valores no array substituem as '?' na ordem.
    const sql = 'INSERT INTO FREQUENCIA ( ID_PESSOA, DATA_MARCADA ) VALUES (?, ?)';
    const [result] = await db.query(sql, [idPessoa, dataMarcada]);
    // Retorna uma resposta de sucesso com o ID do novo frequencia
    res.status(201).json({ id: result.insertId, message: 'frequencia criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar frequencia:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para DELETAR um frequencia existente
exports.deletarFrequencia = async (req, res) => {
  const { idFrequencia } = req.params; 

  if (!idFrequencia) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const sql = 'DELETE FROM FREQUENCIA WHERE ID_FREQUENCIA = ?';
    const [result] = await db.query(sql, [idFrequencia]);

    // Verifica se alguma linha foi de fato alterada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'frequencia não encontrado.' });
    }

    res.status(200).json({ message: 'frequencia deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar frequencia:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


// PESSOA

// Função para LISTAR todos os Pessoas
exports.listarPessoas = async (req, res) => {  
  const { data } = req.params; 
  try {
    const sql = `
          SELECT p.FOTO,
                 p.NOME,
                 0 AS PRESENTE,
                 p.ID_PESSOA
            FROM pessoa p 
           WHERE NOT EXISTS (
            SELECT 1 
              FROM frequencia 
             WHERE ID_PESSOA = p.ID_PESSOA 
               AND DATE(DATA_MARCADA) = ?
           )
           UNION
          SELECT p.FOTO,
                 p.NOME,
                 f.ID_FREQUENCIA AS PRESENTE,
                 p.ID_PESSOA
            FROM pessoa p 
       LEFT JOIN frequencia f
              ON f.ID_PESSOA = p.ID_PESSOA
           WHERE DATE(f.DATA_MARCADA) = ?
        ORDER BY 2
    `;
    const [pessoas] = await db.query(sql, [data, data]);
    res.status(200).json(pessoas);
  } catch (error) {
    console.error('Erro ao listar Pessoas:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para CRIAR um novo Pessoa
exports.criarPessoa = async (req, res) => {
  // Pega os dados do corpo da requisição
  const { idPessoa, nome, foto, aniversario, idade } = req.body;
  
  // Validação simples para garantir que todos os campos foram enviados
  if (!idPessoa || !nome || !foto || !aniversario || !idade ) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // A '?' previne SQL Injection. Os valores no array substituem as '?' na ordem.
    const sql = 'INSERT INTO PESSOA ( ID_PESSOA, NOME, FOTO, ANIVERSARIO, IDADE ) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [idPessoa, nome, foto, aniversario, idade]);
    // Retorna uma resposta de sucesso com o ID do novo Pessoa
    res.status(201).json({ id: result.insertId, message: 'Pessoa criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar Pessoa:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para DELETAR um Pessoa existente
exports.deletarPessoa = async (req, res) => {
  const { idPessoa } = req.body; 

  if (!idPessoa) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const sql = 'DELETE FROM PESSOA WHERE ID_PESSOA = ?';
    const [result] = await db.query(sql, [idPessoa]);

    // Verifica se alguma linha foi de fato alterada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pessoa não encontrado.' });
    }

    res.status(200).json({ message: 'Pessoa deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar Pessoa:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para ATUALIZAR um Pessoa existente
exports.atualizarPessoa = async (req, res) => {
  const { idPessoa, nome, foto, aniversario, idade} = req.body; // Pega os novos dados do corpo

  try {
    const sql = 'UPDATE PESSOA SET ID_PESSOA = ?, NOME = ?, FOTO = ?, ANIVERSARIO = ?, IDADE = ? WHERE ID_PESSOA = ?';
    const [result] = await db.query(sql, [idPessoa, nome, foto, aniversario, idade]);

    // Verifica se alguma linha foi de fato alterada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pessoa não encontrado.' });
    }

    res.status(200).json({ message: 'Pessoa atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar Pessoa:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

