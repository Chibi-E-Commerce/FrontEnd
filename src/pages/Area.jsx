import { useState } from 'react';
import { Imagem, Table } from "../components/Utils";
import voltar from "../assets/images/Voltar.svg"
import ordenar from "../assets/images/Ordenar.svg"
import edit from "../assets/images/Edit.svg"
import remove from "../assets/images/Trash.svg"
import filtroSearch from "../assets/images/filtroSearch.svg";
import "../styles/Area.css"
import { useNavigate } from "react-router-dom";
import { getUsers, getProducts, deleteProduct } from "../api"
import { useModal } from "../ModalContext"


const Endereco = ({ endereco }) => {
    console.log("chegou")

    return (
        <div id="modal-endereco" className='modal'>
            <div className='campo'>
                <h3>Rua</h3>
                <div className='valor'>
                    <h3>{endereco.rua}</h3>
                </div>
            </div>
            <div className='campo'>
                <h3>Estado</h3>
                <div className='valor'>
                        <h3>{endereco.estado}</h3>
                    </div>
                </div>
            <div className='campo'>
                <h3>CEP</h3>
                <div className='valor'>
                        <h3>{endereco.cep}</h3>
                    </div>
                </div>
        </div>
    )
}

const Carrinho = ({ carrinho }) => {

    return (
        <div id="modal-carrinho" className='modal'>
            {
                carrinho.map((product, ind) => (
                    <div key={ind} className='product'>
                        <div className='row-campo'>
                            <div className='campo'>
                                <h3>Nome</h3>
                                <div className='valor'>
                                    <h3>{product.produto.nome}</h3>
                                </div>
                            </div>
                            <div className='campo'>
                                <h3>Preço Unitário</h3>
                                <div className='valor'>
                                        <h3>{"R$ " + (product.produto.preco * ((100 - product.produto.desconto)/100)).toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='row-campo'>
                            <div className='campo'>
                                <h3>Quantidade</h3>
                                <div className='valor'>
                                    <h3>{product.quantidade}</h3>
                                </div>
                                <div className='campo'>
                                <h3>Total</h3>
                                <div className='valor'>
                                    <h3>{"R$ " + ((product.produto.preco * ((100 - product.produto.desconto)/100)) * product.quantidade).toFixed(2)}</h3>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

function Area({}) {
    const navigate = useNavigate()
    const [dados, setDados] = useState(["nada"])
    const [ showDado, setShowDado] = useState(null)
    const { open, close, openModal } = useModal()

    const getDados = async (num) => {
        setDados(num === 1 ? await getUsers() : await getProducts())
    }

    const openModalDados = (tipo, ind) => {
        setShowDado(ind)
        open(tipo)
    }

    return(
        <main id="area-restrita">
            <section id="side-bar">
                <div id='main-side-bar'>
                    <div>
                        <div id="header">
                            <h1>Gestão</h1>
                        </div>
                        <ul>
                            <li onClick={() => getDados(1)}>Usuários</li>
                            <li onClick={() => getDados(2)}>Produtos</li>
                            <li>Dashboard</li>
                        </ul>
                    </div>

                    <div id="voltar" onClick={() => {navigate("/shop")}}>
                        <Imagem src={voltar} alt="Voltar"/>
                        <h1>Voltar</h1>
                    </div>
                </div>
            </section>
        
            <section>
                {
                    dados[0] === "nada" ? (
                        <h1>
                            Bem-Vindo a Area de Administradores
                        </h1>
                    ) : (
                        <>
                            <div id="search-dados">
                                <input
                                type="text"
                                name="pesquisa"
                                placeholder="Pesquisar produto"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                />
                                <div>
                                    <Imagem src={filtroSearch} alt="Procura produto" />
                                </div>
                                <div id='ordenar'>
                                    <Imagem src={ordenar} alt="Ordenar"/>
                                </div>
                            </div>
                            
                            <ul id="dados">
                                {
                                    dados.map((dado, ind) => (
                                        <li key={ind} className='dado'>
                                            <div className='dado-header'>
                                                <div id='image-product-header'>
                                                    { dado.urlImagem && <Imagem src={dado.urlImagem} alt={dado.nome}/>}
                                                    <h3>{dado.nome}</h3>
                                                </div>
                                                <div>
                                                    <div className='icon'>
                                                        <Imagem src={edit} alt="Editar"/>
                                                    </div>
                                                    <div className='icon'>
                                                        <Imagem src={remove} alt={"Deletar"}/>
                                                    </div>
                                                </div>
                                            </div> 

                                            <Table object={dado} keys={Object.keys(dado)} ind={ind} openModal={openModalDados} />
                                            {showDado === ind && openModal === "endereco" && (<Endereco endereco={dado.endereco}/>)}
                                            {showDado === ind && openModal === "carrinho" && (<Carrinho carrinho={dado.carrinho}/>)}
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    )
                }

            </section>
        </main>
    )
}

export default Area;