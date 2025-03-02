import React, { useState } from 'react';
import Cartoes from '../components/Cartao';

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

    return (
        <>
            <div className='pagamento'>
                <div className='pagamento-side'>

                    <form className='pagamento-form'>
                        <h2>Endereço</h2>
                        <div className="endereco">
                            <div className="input-group">
                                <label htmlFor="nome">Rua</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={form.rua}
                                    onChange={handleChange}
                                />
                                {errors.rua && <span className="error">{errors.rua}</span>}
                            </div>
                            <div className="input-group">
                                <label htmlFor="nome">Estado</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={form.estado}
                                    onChange={handleChange}
                                />
                                {errors.estado && <span className="error">{errors.estado}</span>}
                            </div>
                            <div className="input-group">
                                <label htmlFor="nome">CEP</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
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