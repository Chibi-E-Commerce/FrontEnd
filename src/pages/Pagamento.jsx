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

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        cep: '',
        numero_cartao: '',
        dataNascimento: '',
        cod_seguranca: ''
    });

    // const { user } = useContext(UserContext);

    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser("ricardo.mendes@email.com")
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
                                />
                                {errors.rua && <span className="error">{errors.rua}</span>}
                            </div>
                            <div className="pagamento-input-group">
                                <label htmlFor="estado">Estado</label>
                                <select name="estado" id="estado" onChange={handleChange}>
                                    { form.estado === "" ? (
                                                <option value="Hidden" hidden>XX</option>
                                            ) : (
                                                <option value={form.estado} hidden>{form.estado}</option>
                                            )
                                        }
                                    <option value="AC">AC</option>
                                    <option value="AL">AL</option>
                                    <option value="AP">AP</option>
                                    <option value="AM">AM</option>
                                    <option value="BA">BA</option>
                                    <option value="CE">CE</option>
                                    <option value="DF">DF</option>
                                    <option value="ES">ES</option>
                                    <option value="GO">GO</option>
                                    <option value="MA">MA</option>
                                    <option value="MT">MT</option>
                                    <option value="MS">MS</option>
                                    <option value="MG">MG</option>
                                    <option value="PA">PA</option>
                                    <option value="PB">PB</option>
                                    <option value="PR">PR</option>
                                    <option value="PE">PE</option>
                                    <option value="PI">PI</option>
                                    <option value="RJ">RJ</option>
                                    <option value="RN">RN</option>
                                    <option value="RS">RS</option>
                                    <option value="RO">RO</option>
                                    <option value="RR">RR</option>
                                    <option value="SC">SC</option>
                                    <option value="SP">SP</option>
                                    <option value="SE">SE</option>
                                    <option value="TO">TO</option>
                                </select>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    hidden="true"
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
                                    placeholder='00000-000'
                                    value={form.cep}
                                    onChange={handleChange}
                                />
                                {errors.cep && <span className="error">{errors.cep}</span>}
                            </div>
                        </div>
                        <Cartoes cartoes={user ?  user.cartao : []} onClick={completeInputs}></Cartoes>
                        <div className='informacoes-cartao'>
                            <div className="pagamento-input-group nome_completo">
                                <label htmlFor="cod_seguranca">Nome completo</label>
                                <input
                                    type="text"
                                    id="nome_completo"
                                    name="nome_completo"
                                    placeholder='Nome do Titular'
                                    value={form.nome_completo}
                                    onChange={handleChange}
                                />
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
                                    />
                                    {errors.numero_cartao && <span className="error">{errors.numero_cartao}</span>}
                                </div>
                                <div className="pagamento-input-group">
                                    <label htmlFor="bandeira">Bandeira</label>
                                    <select name="bandeira" id="bandeira" value={form.bandeira} onChange={handleChange}>
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
                                    />
                                    {errors.cod_seguranca && <span className="error">{errors.cod_seguranca}</span>}
                                </div>
                                <div className="pagamento-input-group">
                                    <label htmlFor="cartao_validade">Validade</label>
                                    <input
                                        type="month"
                                        id="cartao_validade"
                                        name="cartao_validade"
                                        value={form.cartao_validade}
                                        onChange={handleChange}
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
                                <input className="btn-pagar" type="button" value="COMPRAR" />
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