import React, { useEffect, useState, useContext } from 'react';
import Cartoes from '../components/Cartao';
import { Button, Imagem } from '../components/Utils';
import "../styles/Pagamento.css";
import Gato from '../assets/images/cafe_fofura_felicidade.svg'
import { UserContext } from '../UserContext';
import { OrderContext } from '../OrderContext';
import { updateUser, createOrder } from '../api';
import { PopupSucess, PopupFailed } from '../components/Utils';
import { useNavigate } from 'react-router-dom';

const Pagamento = ({}) => {

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

    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const { removeIntersection } = useContext(OrderContext)
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showExtratoPopup, setShowExtratoPopup] = useState(false);
    const [totalPay, setTotalPay] = useState(0)
    const [form, setForm] = useState({
        rua: '',
        estado: '',
        cep: '',
        numero_cartao: '',
        cod_seguranca: '',
        bandeira: '',
        cartao_validade: '',
        nome_completo: '',
        tipo_pagamento: '',
        cadastrar_cartao: false,
    });

    const [pedidoId, setPedidoId] = useState('');
  
    useEffect(() => {
        if (user.endereco) {
            setForm((prevForm) => ({
                ...prevForm,
                rua: user.endereco.rua,
                estado: user.endereco.estado,
                cep: user.endereco.cep,
            }))
        }
    }, [])

    const sumOrders = () => {
        let sum = 0
        let qntd = 0
        const ordersPay = JSON.parse(localStorage.getItem("ordersPay"))
        ordersPay.map((orderPay) => {
            sum += Number(((orderPay.produto.preco * ((100 - orderPay.produto.desconto)/100)))) * Number(orderPay.quantidade)
            qntd += Number(orderPay.quantidade)
        })
        return [sum.toFixed(2), qntd]
    }

    const completeInputs = (cartao) => {
        setForm((prevForm) => ({
            ...prevForm,
            numero_cartao: cartao.numero,
            cod_seguranca: cartao.cvv,
            bandeira: cartao.bandeira,
            nome_completo: cartao.titular,
            cartao_validade: cartao.validade.ano + "-" + cartao.validade.mes,
            tipo_pagamento: cartao.tipoPagamento
        }))
    }

    const handleChange = (e) => {
        const camposCartao = ["numero_cartao", "bandeira", "cod_seguranca", "nome_completo", "cartao_validade", "tipo_pagamento"]
        const elements = document.getElementsByClassName("cartao-checked")
        if (elements[0] && camposCartao.includes(e.target.name)) {
            elements[0].classList.remove("cartao-checked")
        }

        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const sendForm = async (order) => {
        let k = await createOrder(order)
        console.log(k)
        setPedidoId(k)
    }

    const enviarFormulario = (e) => {
        e.preventDefault();
        let continueProcess = true
        if (validateForm()) {
            try {
                if (user.endereco === null) {
                    user.endereco = {
                        rua: "",
                        estado: "",
                        cep: ""
                    }
                }
                user.endereco.rua = form.rua.trim();
                user.endereco.estado = form.estado.trim();
                user.endereco.cep = form.cep.trim();
                if (user.cartao == null || !user.cartao.some(doc => doc.numero === form.numero_cartao)) {
                    if (user.cartao === null){
                        user.cartao = []
                    }
                    let limite
                    let saldo
                    if (form.tipo_pagamento === "Crédito"){
                        limite = (400 - sumOrders()[0]).toFixed(2)
                    }else{
                        saldo = (1000 - sumOrders()[0]).toFixed(2)
                    }
                    console.log(user.cartao)
                    if (limite >= 0 || saldo >= 0){
                        user.cartao.push({
                            numero: form.numero_cartao,
                            cvv: form.cod_seguranca,
                            bandeira: form.bandeira,
                            validade: {
                                mes: form.cartao_validade[5] + form.cartao_validade[6], 
                                ano: form.cartao_validade.substring(0, 4)
                            },
                            titular: form.nome_completo,
                            saldo : saldo ? Number(saldo) : 0,
                            limite: limite ? Number(limite) : 0,
                            tipoPagamento: form.tipo_pagamento
                        })
                    }else{
                        continueProcess = false
                    }
                }else{
                    user.cartao.forEach((cartao) => {
                        if (cartao.numero === form.numero_cartao){
                            const saldo = cartao.saldo - sumOrders()[0]
                            const limite = cartao.limite - sumOrders()[0]
                            if (limite >= 0  && cartao.tipoPagamento === "Crédito"){
                                cartao.limite = limite < 0 ? 0 : limite
                            }else if (saldo >= 0 && cartao.tipoPagamento === "Débito"){
                                cartao.saldo = saldo < 0 ? 0 : saldo
                            }else{
                                continueProcess = false
                            }
                        }
                    })
                }
                if ( continueProcess ) {
                    setTotalPay(sumOrders()[0])
                    const order = {
                        total: sumOrders()[0],
                        data: new Date().toISOString().split('T')[0],
                        itens: JSON.parse(localStorage.getItem("ordersPay")),
                        client: {
                            id: user.id,
                            nome: user.nome,
                            cpf: user.cpf,
                            email: user.email,
                            endereco: user.endereco
                        }
                    }
                    user.carrinho = removeIntersection()
                    updateUser(user)
                    sendForm(order)
                    setShowSuccessPopup(true);
                } else {
                    setErrorMessage('Saldo Insuficiente');
                    setShowErrorPopup(true);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data);
                    setShowErrorPopup(true);
                } else {
                    console.log(error)
                    setErrorMessage('Erro ao conectar com o servidor');
                    setShowErrorPopup(true);
                }
            }
        }
    }

    const baixarExtrato = async () => {
        try {
            const nomeUsuario = user.nome ?? form.nome_completo;
            const cpfUsuario = user.cpf ?? '';
                const downloadFile = async (formato) => {
                const response = await fetch(
                    `http://localhost:8080/extrato/baixar?pedidoId=${pedidoId}&formato=${formato}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": formato === "pdf" ? "application/pdf" : "text/plain" },
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`Erro ao gerar o arquivo ${formato}`);
                }
    
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `comprovante_chibi.${formato}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
                await Promise.all([downloadFile("pdf"), downloadFile("txt")]);
    
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
        tipo_pagamento: ''
    });

    
    const validateForm = () => {
        let valid = true;
        let newErrors = {
            rua: '',
            estado: '',
            cep: '',    
            numero_cartao: '',
            cod_seguranca: '',
            tipo_pagamento: ''
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

        if (!form.tipo_pagamento) {
            newErrors.tipo_pagamento = 'Forma de pagamento é obrigatória';
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


    const showPopupExtrato = () => {
        setShowSuccessPopup(false)
        setShowExtratoPopup(true)
    }

    const closePopupExtrato = () => {
        setShowExtratoPopup(false)
        baixarExtrato()
        navigate("/shop")
    }

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
                                                <option value="Hidden" hidden={true}>XX</option>
                                            ) : (
                                                <option value={form.estado} hidden={true}>{form.estado}</option>
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
                                    hidden={true}
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
                        <Cartoes cartoes={user.cartao ? user.cartao : []} onClick={completeInputs}></Cartoes>
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
                                                <option value="Hidden" hidden={true}>Selecione uma opção</option>
                                            ) : (
                                                <option value={form.bandeira} hidden={true}>{form.bandeira}</option>
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
                                <div className="pagamento-input-group cvv-div">
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
                                    <label htmlFor="tipo_pagamento">Forma de Pagamento</label>
                                    <select name="tipo_pagamento" id="tipo_pagamento" value={form.tipo_pagamento} onChange={handleChange} required>
                                        { form.tipo_pagamento === "" ? (
                                                <option value="Hidden" hidden={true}>Selecione uma opção</option>
                                            ) : (
                                                <option value={form.tipo_pagamento} hidden={true}>{form.tipo_pagamento}</option>
                                            )
                                        }
                                        <option value="Débito">Débito</option>
                                        <option value="Crédito">Crédito</option>
                                    </select>
                                    {errors.tipo_pagamento && <span className="error">{errors.tipo_pagamento}</span>}
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
        {showErrorPopup && (
            <PopupFailed errorMessage={errorMessage} setShowErrorPopup={() => setShowErrorPopup()}/>
        )}

        {showSuccessPopup && (
            <PopupSucess sucessMessage="Pagamento Concluído" setShowSucessPopup={showPopupExtrato}/>
        )}

        {showExtratoPopup && (
            <div className="success-popup">
                <div className="success-popup-content">
                    <p>Baixar Extrato</p>
                    <div className="extrato-popup">
                        <Button text="Voltar" onClick={() => {setShowExtratoPopup(false); navigate("/shop")}}/>
                        <Button text="Baixar" onClick={() => {baixarExtrato(); navigate("/shop")}}/>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}


export default Pagamento;