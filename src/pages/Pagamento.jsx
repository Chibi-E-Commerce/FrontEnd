import React, { useEffect, useState, useContext } from 'react';
import Cartoes from '../components/Cartao';
import { Checkbox, Imagem } from '../components/Utils';
import "../styles/Pagamento.css";
import Gato from '../assets/images/cafe_fofura_felicidade.svg'
import { UserContext } from '../UserContext';
import { OrderContext } from "../OrderContext"
import { getDados, getUser } from '../api';

const Pagamento = ({  }) => {

    const estados = {
        "Acre": "AC",
        "Alagoas": "AL",
        "Amapá": "AP",
        "Amazonas": "AM",
        "Bahia": "BA",
        "Ceará": "CE",
        "Distrito Federal": "DF",
        "Espírito Santo": "ES",
        "Goiás": "GO",
        "Maranhão": "MA",
        "Mato Grosso": "MT",
        "Mato Grosso do Sul": "MS",
        "Minas Gerais": "MG",
        "Pará": "PA",
        "Paraíba": "PB",
        "Paraná": "PR",
        "Pernambuco": "PE",
        "Piauí": "PI",
        "Rio de Janeiro": "RJ",
        "Rio Grande do Norte": "RN",
        "Rio Grande do Sul": "RS",
        "Rondônia": "RO",
        "Roraima": "RR",
        "Santa Catarina": "SC",
        "São Paulo": "SP",
        "Sergipe": "SE",
        "Tocantins": "TO"
    }



    const { ordersPay } = useContext(OrderContext)
    const [form, setForm] = useState({
        rua: '',
        estado: '',
        cep: '',
        numero_cartao: '',
        cod_seguranca: '',
        bandeira: '',
        cartao_validade: '',
        nome_completo: '',
    });

    // const { user } = useContext(UserContext);

    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser("carlos.lima@email.com")
            setUser(response)
            setForm((prevForm) => ({
                ...prevForm,
                rua: response.endereco.rua, 
                estado: estados[response.endereco.estado],
                cep: response.endereco.cep,
            }))
        }
        fetchUser()
    }, [])
    useEffect(() => {
        if (user){
        console.log("User atualizado:", user)
        console.log("Endereco atualizado:", form)
        }
    }, [user])

    const sumOrders = () => {
        let sum = 0
        let qntd = 0
        ordersPay.map((orderPay) => {
            sum += orderPay[0].preco * orderPay[1]
            qntd += orderPay[1]
        })
        return [sum, qntd]
    }

    const completeInputs = (cartao) => {
        setForm((prevForm) => ({
            ...prevForm,
            numero_cartao: cartao.numero,
            cod_seguranca: cartao.cvv,
            bandeira: cartao.bandeira,
            nome_completo: cartao.titular,
            cartao_validade:"20" + cartao.validade.ano + "-" + cartao.validade.mes
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(value)
        setForm({
            ...form,
            [name]: value
        });
    };

    const enviarFormulario = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Bonito.");
        } else {
            console.log("feio")
        }
    }

    const baixarExtrato = async () => {
        try {
            const nomeUsuario = user.nome ?? form.nome_completo;
            const cpfUsuario = user.cpf ?? '';
            const response = await fetch(
                `http://localhost:8080/pdf/extrato?nome=${nomeUsuario}&cpf=${cpfUsuario}&valor=${sumOrders()[0]}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/pdf" },
                }
            );
        
            if (!response.ok) {
                throw new Error("Erro ao gerar o PDF");
            }
        
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "comprovante_chibi.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao baixar extrato:", error);
        }
    };

    const [errors, setErrors] = useState({
        rua: '',
        estado: '',
        cep: '',
        numero_cartao: '',
        cod_seguranca: '',
        bandeira: '',
        cartao_validade: '',
        nome_completo: '',
    });

    
    const validateForm = () => {
        let valid = true;
        let newErrors = {
            rua: '',
            estado: '',
            cep: '',    
            cep: '',
            numero_cartao: '',
            cod_seguranca: ''
        };

        if (!form.rua) {
            newErrors.rua = 'Rua é obrigatória';
            valid = false;
        }

        if (!form.estado) {
            newErrors.rua = 'Estado é obrigatório';
            valid = false;
        }

        if (!form.nome_completo) {
            newErrors.nome_completo = 'Nome completo é obrigatório';
            valid = false;
        }

        if (!form.bandeira) {
            newErrors.bandeira = 'Bandeira é obrigatória';
            valid = false;
        }

        if (!form.cartao_validade) {
            newErrors.cartao_validade = 'Validade do cartão é obrigatória';
            valid = false;
        }


        

        if (!RegExp(/^\d{5}-\d{3}$/).test(form.cep)) {
            valid = false;
            newErrors.cep = "CEP Inválido, digite no formato 00000-000"
        }

        if (!RegExp(/^\d{4} \d{4} \d{4} \d{4}$/).test(form.numero_cartao)) {
            valid = false;
            newErrors.numero_cartao = 'Número de cartão inválido, digite no formato XXXX XXXX XXXX XXXX'
        }

        if (!RegExp(/^\d{3}$/).test(form.cod_seguranca)) {
            valid = false;
            newErrors.cod_seguranca = 'Código de segurança inválido'
        }


        setErrors(newErrors);
        return valid;
    };
      

    return (
        <>
            <div className='pagamento'>
                <div className='pagamento-side'>

                    <form className='pagamento-form'>
                        <h2 className='pagamento-title'>Endereço</h2>
                        <div className="endereco">
                            <div className="pagamento-input-group">
                                <label htmlFor="rua">Rua</label>
                                <input
                                    type="text"
                                    id="rua"
                                    name="rua"
                                    placeholder='Rua Maria Joaquim'
                                    value={form.rua}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.rua && <span className="error">{errors.rua}</span>}
                            </div>
                            <div className="pagamento-input-group">
                                <label htmlFor="estado">Estado</label>
                                <select name="estado" id="estado" onChange={handleChange} required>
                                    { form.estado === "" ? (
                                                <option value="Hidden" hidden>XX</option>
                                            ) : (
                                                <option value={form.estado} hidden>{form.estado}</option>
                                            )
                                        }
                                    {Object.entries(estados).map(([key, value]) => (
                                        <option key={value} value={value}>{key}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    hidden="true"
                                    value={form.estado}
                                    required
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
                                    placeholder='00000-000'
                                    value={form.cep}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.cep && <span className="error">{errors.cep}</span>}
                            </div>
                        </div>
                        <Cartoes cartoes={user ? user.cartao : []} onClick={completeInputs}></Cartoes>
                        <div className='informacoes-cartao'>
                            <div className="pagamento-input-group nome_completo">
                                <label htmlFor="nome_completo">Nome completo</label>
                                <input
                                    type="text"
                                    id="nome_completo"
                                    name="nome_completo"
                                    placeholder='Nome do Titular'
                                    value={form.nome_completo}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.nome_completo && <span className="error">{errors.nome_completo}</span>}
                            </div>
                            <div className='num-cartao-grupo'>
                                <div className="pagamento-input-group">
                                    <label htmlFor="numero_cartao">Número do Cartão</label>
                                    <input
                                        type="text"
                                        id="numero_cartao"
                                        name="numero_cartao"
                                        placeholder='XXXX XXXX XXXX XXXX'
                                        value={form.numero_cartao}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.numero_cartao && <span className="error">{errors.numero_cartao}</span>}
                                </div>
                                <div className="pagamento-input-group">
                                    <label htmlFor="bandeira">Bandeira</label>
                                    <select name="bandeira" id="bandeira" value={form.bandeira} onChange={handleChange} required>
                                        { form.bandeira === "" ? (
                                                <option value="Hidden" hidden>Selecione uma opção</option>
                                            ) : (
                                                <option value={form.bandeira} hidden>{form.bandeira}</option>
                                            )
                                        }
                                        <option value="MasterCard">MasterCard</option>
                                        <option value="Elo">Elo</option>
                                        <option value="Visa">Visa</option>
                                        <option value="Amex">Amex</option>
                                    </select>
                                    {errors.bandeira && <span className="error">{errors.bandeira}</span>}

                                </div>
                            </div>
                            <div className='cod-seguranca-row'>
                                <div className="pagamento-input-group">
                                    <label htmlFor="cod_seguranca">Cód. Segurança</label>
                                    <input
                                        type="text"
                                        id="cod_seguranca"
                                        name="cod_seguranca"
                                        placeholder='XXX'
                                        value={form.cod_seguranca}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.cod_seguranca && <span className="error">{errors.cod_seguranca}</span>}
                                </div>
                                <div className="pagamento-input-group">
                                    <label htmlFor="cartao_validade">Validade (mês/ano)</label>
                                    <input
                                        type="month"
                                        id="cartao_validade"
                                        name="cartao_validade"
                                        value={form.cartao_validade}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.cartao_validade && <span className="error">{errors.cartao_validade}</span>}
                                </div>
                            </div>
                        </div>
                        
                        <div className='form-enviar'>
                            <Checkbox name={"87"}/>
                            <div className='btn-pagar-row'>
                                <div className="info-pagamento">
                                    <span id='valor-total'>R$ { sumOrders()[0] }</span>
                                    <span id='qnt-itens'>Total de itens: { sumOrders()[1] }</span>
                                </div>
                                <input className="btn-pagar" type="button" value="COMPRAR" onClick={enviarFormulario}/>
                            </div>
                        </div>
                    </form>
                </div>
            <Imagem src={Gato} alt="Gato fofo!!" className='img-cat'/>
        </div>
        <button className="btn-extrato" onClick={baixarExtrato}>Baixar Extrato</button>
        </>
    )
}


export default Pagamento;