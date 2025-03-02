import React, { useState } from 'react';
import '../styles/Cadastro.css';

const Cadastro = () => {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: ''
    });

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { nome: '', email: '', senha: '' };

        if (!form.nome) {
            newErrors.nome = 'Nome é obrigatório';
            valid = false;
        }

        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Por favor, insira um e-mail válido';
            valid = false;
        }

        if (!form.senha || form.senha.length < 6) {
            newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Formulário enviado:', form);
        }
    };

    return (
        <main>
            <div className="cadastro-card">
                <h2>Cadastro</h2>
                <form onSubmit={handleSubmit} className="cadastro-form">
                    <div className="input-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange} />
                        {errors.nome && <span className="error">{errors.nome}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange} />
                        {errors.senha && <span className="error">{errors.senha}</span>}
                    </div>

                    <button type="submit" className="submit-btn">CADASTRAR</button>
                    <a>Já tem conta?</a>
                </form>
            </div>
        </main>
    );
};

export default Cadastro;
