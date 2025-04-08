import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AlterarSenha() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  console.log("Email recebido para troca de senha:", email);

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
    <div>
      <h2>Alterar Senha</h2>
      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />
      <button onClick={handleAlterarSenha}>Alterar Senha</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default AlterarSenha;