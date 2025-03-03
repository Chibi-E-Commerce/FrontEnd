import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getDados } from './api';
import HomePage from './pages/Cadastro';
import NavBar from './components/Navbar';
import Shopping from './pages/Shopping';

function App() {
    const [dados, setDados] = useState([]);

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
            <AppContent dados={dados} />
        </Router>
    );
}

function AppContent({ dados }) {
    const location = useLocation();
    console.log("Rota atual:", location.pathname);

    return (
        <div>
            <NavBar carrinho={location.pathname === "/shop"} />

            <Routes>
                <Route path="/" element={<HomePage />} />
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
                <Route path="/shop" element={<Shopping products={dados} />} />
            </Routes>
        </div>
    );
}

export default App;
