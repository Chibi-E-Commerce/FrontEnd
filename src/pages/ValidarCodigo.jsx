import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ValidarCodigo() {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleValidarCodigo = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/validar-codigo', {
        email: email.trim(),
        codigo: codigo.trim()
      });

      setMensagem("Código válido!");
      navigate("/alterar-senha", { state: { email } });
    } catch (error) {
      setMensagem("Código inválido ou expirado.");
    }
  };

  return (
    <div className='center-container'>
      <h2>Validar Código</h2>
      <div className='inputs'>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
      </div>
      <button onClick={handleValidarCodigo}>Validar</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default ValidarCodigo;
