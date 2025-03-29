import { useState } from 'react';
import { Button, Imagem, Table } from "../components/Utils";
import voltar from "../assets/images/Voltar.svg"
import ordenar from "../assets/images/Ordenar.svg"
import edit from "../assets/images/Edit.svg"
import remove from "../assets/images/Trash.svg"
import filtroSearch from "../assets/images/filtroSearch.svg";
import "../styles/Area.css"
import { useNavigate } from "react-router-dom";
import { getUsers, getProducts, deleteProduct, deleteClient, getDataFilteredRestricted, getClientFiltered, getClientSorted, getDataSorted } from "../api"

function Area({}) {
    const navigate = useNavigate()
    const [dados, setDados] = useState(["nada"])
    const [tipoDados, setTipoDados] = useState("")
    const [showDelete, setShowDelete] = useState(-1)

    const getDados = async (num) => {
        setDados(num === 1 ? await getUsers() : await getProducts())
        setShowDelete(-1)
        setTipoDados(num === 1 ? "Usuário" : "Produto")
    }

    const deleteDado = async (valor) => {
        if (tipoDados === "Produto") {
            await deleteProduct(valor)
        }else{
            await deleteClient(valor)
        }
        await getDados(tipoDados === "Produto" ? 2 : 1)
    }

    const search = async (e) => {
        const valor = e.target.value.trim()
        if (!valor) {
            await getDados(tipoDados === "Produto" ? 2 : 1)
            return;
        }
        const filter = tipoDados === "Produto"
            ? {
                "pesquisa": valor,
                "precoMin": 0,
                "precoMax": 0,
                "inDesconto": 0,
                "categoria": [valor],
                "marca": valor
            }
            : {
                "nome": valor,
                "email": valor,
                "cpf": valor
            };
        setDados(tipoDados === "Produto"
            ? await getDataFilteredRestricted(filter)
            : await getClientFiltered(filter))
    };

    const sorted = async () => {
        setDados(tipoDados === "Produto"
            ? await getDataSorted()
            : await getClientSorted()
        )
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
                                    onChange={search} // Aqui passa a função corretamente
                                />
                                <div>
                                    <Imagem src={filtroSearch} alt="Procura produto" />
                                </div>
                                <div id='ordenar' onClick={() => sorted()}>
                                    <Imagem src={ordenar} alt="Ordenar" />
                                </div>
                                <div id='add'>
                                    <h1>+</h1>
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
                                                    <div className={"icon " + ind}>
                                                        <Imagem src={edit} alt="Editar"/>
                                                    </div>
                                                    <div className='icon'>
                                                        <Imagem src={remove} alt={"Deletar"} onClick={() => {setShowDelete(ind)}}/>
                                                        {showDelete === ind && (
                                                            <div id='modal-delete'>
                                                                <h3>Deseja apagar esse {tipoDados}?</h3>
                                                                <div className='buttons'>
                                                                    <Button text={"Cancelar"} onClick={() => {
                                                                        setShowDelete(-1)
                                                                    }}/>
                                                                    <Button text={"Deletar"} onClick={() => deleteDado(tipoDados === "Produto" ? dado.nome : dado.email)}/>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div> 

                                            <Table object={dado} keys={Object.keys(dado)} ind={ind}/>
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