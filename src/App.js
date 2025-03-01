// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getDados } from './api';
import HomePage from './Cadastro';

function App() {
    const [dados, setDados] = useState([]);

    // Função para pegar os dados da API
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDados();
                setDados(data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <Router>
            <div>
                {/* Link para a página inicial */}
                <nav>
                    <Link to="/">Página Inicial</Link> | 
                    <Link to="/dados"> Dados da API</Link>
                </nav>

                <Routes>
                    {/* Página inicial */}
                    <Route path="/" element={<HomePage />} />

                    {/* Página dos dados */}
                    <Route path="/dados" element={
                        <div>
                            <h1>Dados da API</h1>
                            <ul>
                                {dados.length === 0 ? (
                                    <li>Carregando...</li>
                                ) : (
                                    dados.map((item, index) => (
                                        <li key={index}>{item.nome}</li>
                                    ))
                                )}
                            </ul>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
