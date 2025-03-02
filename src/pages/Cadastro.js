import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Cadastro.css';

const Cadastro = () => {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        dataNascimento: ''
    });
    
    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        dataNascimento: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { nome: '', email: '', senha: '', cpf: '', dataNascimento: '' };

        if (!form.nome) {
            newErrors.nome = 'Nome é obrigatório';
            valid = false;
        }

        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Por favor, insira um e-mail válido';
            valid = false;
        }

        if (!form.senha || form.senha.length < 8) {
            newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
            valid = false;
        }

        if (!form.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
            newErrors.cpf = 'CPF inválido (use o formato 000.000.000-00)';
            valid = false;
        }

        if (!form.dataNascimento) {
            newErrors.dataNascimento = 'Data de nascimento é obrigatória';
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
        <>
            <div className="top-left-image"></div>
            <div className="bottom-right-image"></div>
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
                            onChange={handleChange}
                        />
                        {errors.nome && <span className="error">{errors.nome}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="input-group password-group">
                        <label htmlFor="senha">Senha</label>
                        <div className="password-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="senha"
                                name="senha"
                                value={form.senha}
                                onChange={handleChange}
                            />
                            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.senha && <span className="error">{errors.senha}</span>}
                    </div>

                    <div className="cpf-dob-container">
                        <div className="input-group">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                            />
                            {errors.cpf && <span className="error">{errors.cpf}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="dataNascimento">Data de Nascimento</label>
                            <input
                                type="date"
                                id="dataNascimento"
                                name="dataNascimento"
                                value={form.dataNascimento}
                                onChange={handleChange}
                            />
                            {errors.dataNascimento && <span className="error">{errors.dataNascimento}</span>}
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">CADASTRAR</button>

                    <div className="login-link">
                        <a href="/login">Já tem conta?</a>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Cadastro;