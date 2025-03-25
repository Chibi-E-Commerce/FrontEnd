import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getProducts } from './api';
import HomePage from './pages/Cadastro';
import NavBar from './components/Navbar';
import Shopping from './pages/Shopping';
import Pagamento from './pages/Pagamento';
import Area from './pages/Area';
import { OrderProvider } from './OrderContext';
import { ModalProvider } from './ModalContext';
import { UserProvider } from './UserContext';
import Login from './pages/Login';
import Dash from './components/Dash';

function App() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Router>
      <UserProvider>
        <ModalProvider>
          <OrderProvider>
              <AppContent dados={dados}/>
          </OrderProvider>
        </ModalProvider>
      </UserProvider>
    </Router>
  );
}

function AppContent({ dados }) {
  const location = useLocation();

  return (
    <div>
      <NavBar carrinho={location.pathname === "/shop"} area={location.pathname === "/shop"} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={
            <Shopping productsBase={dados} />
        } />
        <Route path="/login" element={
          <Login />
          } 
        />
        <Route path="/pay" element={
            <Pagamento/>
        } />
        <Route path="/area" element={
            <Area />
        } />
        <Route path='/dash' element={
          <Dash>{}</Dash>
        }/>
        
      </Routes>
    </div>
  );
}

export default App;