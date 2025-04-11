import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Senha.css';

function AlterarSenha() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleAlterarSenha = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/alterar-senha", {
        email: email.trim(),
        novaSenha: novaSenha.trim()
      });

      setMensagem("Senha alterada com sucesso!");
      navigate("/login");
    } catch (error) {
      setMensagem("Erro ao alterar a senha.");
      console.error("Erro ao alterar senha:", error);
    }
  };

  return (
    <div className='senha-container'> 
      <div className="bottom-left-image"></div>
      <div className="top-right-image"></div>
      <h2>Alterar Senha</h2>
      <input
        className='senha-input'
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />
      <button 
      className='btn-send'
      onClick={handleAlterarSenha}>Alterar Senha</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default AlterarSenha;