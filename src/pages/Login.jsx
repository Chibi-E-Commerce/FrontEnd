import React, { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Login.css';
import axios from 'axios';
import { getUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../UserContext"
import { PopupFailed } from '../components/Utils';

const Login = () => {
    const [form, setForm] = useState({ email: '', senha: '' });
    const [errors, setErrors] = useState({ email: '', senha: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const { addUser } = useContext(UserContext)
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { email: '', senha: '' };

        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Por favor, insira um e-mail válido';
            valid = false;
        }
        if (!form.senha || form.senha.length < 8) {
            newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Validar auth com a api
                const response = await axios.post('http://localhost:8080/auth/login', form);

                // Pegar dado do usuário para o contexto
                const user_complete = await getUser(form.email);

                addUser(user_complete);

                setErrorMessage(response.data);
                setShowErrorPopup(false);
                navigate('/shop');

            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data);
                    setShowErrorPopup(true);
                } else {
                    setErrorMessage('Erro ao conectar com o servidor');
                    setShowErrorPopup(true);
                }
            }
        }
    };

    return (
        <main id='login'>
            <div className="bottom-left-image"></div>
            <div className="top-right-image"></div>
            <div className="login-card-login">
                <h2>Entrar</h2>
                <form onSubmit={handleSubmit} className="login-form-login">
                    <div className="input-group-login">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange} 
                        />
                        {errors.email && <span className="error-login">{errors.email}</span>}
                    </div>
                    <div className="input-group-login password-group-login">
                        <label htmlFor="senha">Senha</label>
                        <div className="password-group-login">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="senha" 
                                name="senha" 
                                value={form.senha} 
                                onChange={handleChange} 
                            />
                            <button 
                                type="button" 
                                className="eye-button-login" 
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.senha && <span className="error-login">{errors.senha}</span>}
                    </div>
                    {showErrorPopup && (
                        <PopupFailed errorMessage={errorMessage} setShowErrorPopup={() => setShowErrorPopup(false)}/>
                    )}

                    <button type="submit" className="submit-btn-login">ENTRAR</button>
                    <div className="login-link-login">
                        <a href="/">Ainda não tem uma conta?</a>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
