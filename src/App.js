import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getDados } from './api';
import HomePage from './pages/Cadastro';
import NavBar from './components/Navbar';
import Shopping from './pages/Shopping';
import Pagamento from './pages/Pagamento';
import { OrderProvider } from './OrderContext';
import { ModalProvider } from './ModalContext';

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
      <ModalProvider>
        <OrderProvider>
            <AppContent dados={dados}/>
        </OrderProvider>
      </ModalProvider>
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
        <Route path="/shop" element={
            <Shopping products={dados} />
        } />
        <Route path="/pay" element={
            <Pagamento />
        } />
      </Routes>
    </div>
  );
}

export default App;