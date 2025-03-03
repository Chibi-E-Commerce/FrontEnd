import React, { useState } from 'react';
import Cartoes from '../components/Cartao';
import "../styles/Pagamento.css";

const Pagamento = () => {
    const [form, setForm] = useState({
        rua: '',
        estado: '',
        cep: '',
        cartao_index: '',
        numero_cartao: '',
        cod_seguranca: '',
        cartao_mes: '',
        cartao_ano: '',
        nome_completo: ''
    });

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        dataNascimento: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const enviarFormulario = (e) => {
        e.preventDefault();
        console.log("hello");
    }

    return (
        <>
            <div className='pagamento'>
                <div className='pagamento-side'>

                    <form className='pagamento-form'>
                        <h2>Endereço</h2>
                        <div className="endereco">
                            <div className="pagamento-input-group">
                                <label htmlFor="rua">Rua</label>
                                <input
                                    type="text"
                                    id="rua"
                                    name="rua"
                                    value={form.rua}
                                    onChange={handleChange}
                                />
                                {errors.rua && <span className="error">{errors.rua}</span>}
                            </div>
                            <div className="pagamento-input-group">
                                <label htmlFor="estado">Estado</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                />
                                {errors.estado && <span className="error">{errors.estado}</span>}
                            </div>
                            <div className="pagamento-input-group">
                                <label htmlFor="cep">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    pattern='\d{5}-\d{3}'
                                    value={form.cep}
                                    onChange={handleChange}
                                />
                                {errors.cep && <span className="error">{errors.cep}</span>}
                            </div>
                        </div>
                        <Cartoes numeros={[123, 456, 789]}></Cartoes>
                        
                    </form>
                </div>
            </div>
        </>
    )
}


export default Pagamento;