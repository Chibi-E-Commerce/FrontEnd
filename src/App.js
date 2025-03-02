import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cadastro from './Cadastro';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Cadastro />} />
            </Routes>
        </Router>
    );
}

export default App;