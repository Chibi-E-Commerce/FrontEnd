// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getDados } from './api';
import HomePage from './pages/Cadastro';
import NavBar from './components/Navbar';
import Pagamento from './pages/Pagamento';

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
                {/* Navbar recebe nos texts os textos dos links das rotas e  */}
                <NavBar/>

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

                    {/* <Route path="/shop" element={<Shopping />} /> */}
                    <Route path="/pay" element={<Pagamento />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
