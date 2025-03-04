import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getDados } from './api';
import HomePage from './pages/Cadastro';
import NavBar from './components/Navbar';
import Shopping from './pages/Shopping';
import Pagamento from './pages/Pagamento';
import Login from './pages/Login';

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
                <Route path="/login" element={<Login />} />
                <Route path="/pay" element={<Pagamento valor_total={1000} total_itens={49} id_cliente={"67bde97cbad2e60660df4810"} />} />
            </Routes>
        </div>
    );
}

export default App;