import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleEnviarCodigo = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/esqueci-senha', { email });
      setMensagem(response.data);
      setErro('');
      navigate('/validar-codigo');
    } catch (error) {
      setErro('Erro ao enviar o código. Verifique o e-mail.');
      setMensagem('');
      console.error(error);
    }
  };

  return (
    <div className="esqueci-senha-container">
      <h2>Esqueci minha senha</h2>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={handleEnviarCodigo}>
        Enviar código
      </button>
      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}

export default EsqueciSenha;