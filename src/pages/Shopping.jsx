import { Imagem, Button, CheckboxManual } from "../components/Utils";
import filtroDelete from "../assets/images/filtroDelete.svg";
import filtroAdd from "../assets/images/filtroAdd.svg";
import filtroRetirar from "../assets/images/filtroRetirar.svg";
import filtroSearch from "../assets/images/filtroSearch.svg";
import "../styles/Shopping.css";
import { useState, useEffect, useContext } from "react";
import FilterBar from "../components/FilterBar";
import SideBarProduct from "../components/SideBarProduct";
import { useModal } from "../ModalContext";
import { OrderContext } from "../OrderContext";
import { getDataFiltered, getDados } from "../api";
import { UserContext } from "../UserContext"
 
function Shopping({ productsBase }) {
    const { orders } = useContext(OrderContext);
    const [showSideProduct, setShowSideProduct] = useState(null);
    const [products, setProducts] = useState(productsBase);
    const { open, close, openModal } = useModal();
    const [filter, setFilter] = useState({});
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (productsBase && productsBase.length > 0) {
            setProducts(productsBase);
        }
    }, [productsBase]);

    useEffect(() => {
        console.log("Carrinho Atualizado: ", orders);
        console.log(user)
    }, [orders]);

    const addFilter = (filterNew) => {
        if (filter[filterNew["tipo"]] === undefined || filter[filterNew["tipo"]] === null) {
            if (filterNew["tipo"] === "categoria"){
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    [filterNew.tipo]: filterNew.valor,
                    [filterNew.showDrop] : null
                }))
            }else{
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    [filterNew.tipo]: filterNew.valor
                }))
            }
        }
    }

    const colorLi = (tipo) => {
        if (tipo === "precoMax") {
        return "#F0CF7F"
        } else if (tipo === "precoMin") {
        return "#F05F4B"
        } else if (tipo === "marca") {
        return "#F0C04B"
        } else if (tipo === "categoria") {
        return "#F0E04B"
        } else if (tipo === "inDesconto") {
        return "#F09F4B"
        } else {
        return "#F07F1A"
        }
    }

    const removeAllFilters = () => {
        setFilter({})
    }

    const removeFilter = (campo) => {
        setFilter((prevFilter) => {

            if (campo === "categoria"){
                return {
                    ...prevFilter,
                    "categoria": null,
                    "showDrop": null
                }
            }else{
                return{
                ...prevFilter,
                [campo]: null
                }
            }
        })
    }

    const updateValueFilter = (e) => {
        let valor = e.target.value
        if (valor !== ""){
            setFilter((prevFilter) => ({
                ...prevFilter,
                [e.target.name]: valor
            }))
        }else{
            removeFilter(e.target.name)
        }
        close()
    }

    const updateCategory = (valor) => {
        setFilter((prevFilter) => {
            const currentCategories = prevFilter.categoria || []
            
            if (currentCategories.includes(valor)) {
                return {
                    ...prevFilter,
                    categoria: currentCategories.filter((cat) => cat !== valor)
                }
            } else {
                return {
                    ...prevFilter,
                    categoria: [...currentCategories, valor]
                }
            }
        })
    }


    const sendFilter = async () => {
        const filterSanitizeModel = {
            pesquisa : "",
            precoMin : 0,
            precoMax : 0,
            inDesconto : 0,
            categoria : [],
            marca : ""
        }
        let filterSanitize = {...filterSanitizeModel, ...filter}
        delete filterSanitize.showDrop
        Object.keys(filterSanitize).forEach((key) => {
            if (filterSanitize[key] === null){
                filterSanitize[key] = filterSanitizeModel[key]
            }
        })

        const newProducts = JSON.stringify(filterSanitizeModel) === JSON.stringify(filterSanitize)
        ? await getDados()
        : await getDataFiltered(filterSanitize);
        
        setProducts(newProducts || []);
    }

    

    const openFilters = (name) => {
        if (openModal === name){
            close()
        }else{
            open(name)
        }

    }

    const openSideProduct = (ind) => {
        if (showSideProduct === ind) {
            setShowSideProduct(null)
        } else {
            setShowSideProduct(ind)
        }
        open("sideBarProduct")
    }

    const openDropCategory = (tipo) => {
        if (tipo === "categoria"){
            if (filter.showDrop === null){
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    ["showDrop"]: "show"
                }))
            }else{
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    ["showDrop"]: null
                }))
            }
        }
    }

    return (
        <main>
        <section id="filtro">
            <form onSubmit={(e) => e.preventDefault()}>
            <div id="search-filtro">
                <input
                type="text"
                name="pesquisa"
                placeholder="Pesquisar produto"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={updateValueFilter}
                />
                <div>
                <Imagem src={filtroSearch} alt="Procura produto" />
                </div>
            </div>

            <div>
                <div id="header-filtro">
                    <h3>Filtro</h3>
                    <div id="header-icons">
                        <Imagem
                        src={filtroDelete}
                        alt="Deletar filtro"
                        onClick={() => {
                            removeAllFilters()
                        }}
                        />
                        <Imagem
                        src={filtroAdd}
                        alt="Adicionar filtro"
                        onClick={() => {
                            openFilters("filterBar")
                        }}
                        />
                    </div>
                </div>

                <ul>
                    {Object.keys(filter).map((tipo, index) => (
                        filter[tipo] !== null &&
                        (tipo !== "showDrop" ? (
                        <li key={index}>
                            <div className="image-remove" onClick={() => removeFilter(tipo)}>
                            <Imagem src={filtroRetirar} alt="Retirar filtro" />
                            </div>
                            <div
                            className="div-filter"
                            style={{ backgroundColor: colorLi(tipo) }}
                            onClick={() => openDropCategory(tipo)}
                            >
                            {tipo === "precoMin" || tipo === "precoMax" ? (
                                <>
                                <label htmlFor={tipo}>
                                    {tipo === "precoMin" ? "Mín" + ": R$ " : "Máx" + ": R$ "}
                                </label>
                                <input
                                    type="number"
                                    name={tipo}
                                    value={filter[tipo]}
                                    onChange={updateValueFilter}
                                />
                                </>
                            ) : tipo === "marca" ? (
                                <>
                                <label htmlFor={tipo}>Marca: </label>
                                <input
                                    type="text"
                                    name={tipo}
                                    placeholder={filter[tipo]}
                                    onChange={updateValueFilter}
                                />
                                </>
                            ) : (
                                <>
                                <p>
                                    {tipo === "categoria"
                                    ? "Categorias"
                                    : tipo === "inDesconto"
                                    ? "Em Desconto"
                                    : "Nome:"}
                                </p>
                                <p className="p-valor">{ (tipo !== "categoria" && tipo !== "inDesconto") ? filter[tipo] : <></>}</p>
                                </>
                            )}
                            </div>
                        </li>
                        ) : (
                            <li id="categorias">
                                <label>
                                    <CheckboxManual name="Salgado" checked={filter.categoria.includes("Salgado")} onChange={() => updateCategory("Salgado")}/>
                                    Salgado
                                </label>
                                <label>
                                    <CheckboxManual name="Doce" checked={filter.categoria.includes("Doce")} onChange={() => updateCategory("Doce")}/>
                                    Doce
                                </label>
                                <label>
                                    <CheckboxManual name="Bebida" checked={filter.categoria.includes("Bebida")} onChange={() => updateCategory("Bebida")}/>
                                    Bebida
                                </label>
                                <label>
                                    <CheckboxManual name="Quente" checked={filter.categoria.includes("Quente")} onChange={() => updateCategory("Quente")}/>
                                    Quente
                                </label>
                                <label>
                                    <CheckboxManual name="Gelado" checked={filter.categoria.includes("Gelado")} onChange={() => updateCategory("Gelado")}/>
                                    Gelado
                                </label>
                            </li>
                        ))
                    ))}


                    </ul>


                <Button text={<h3>Pesquisar</h3>} onClick={() => sendFilter()}/>
            </div>

            {openModal === "filterBar" && <FilterBar addFilter={addFilter} />}
            </form>
        </section>
        <section>
            {products.map((product, ind) => (
            <div key={ind} className="product" onClick={() => openSideProduct(ind)}>
                <div className="image-product">
                <Imagem src={product.urlImagem} alt={product.nome} />
                </div>
                <h3>{product.nome}</h3>
                <p>{product.marca}</p>

                <Button text={"R$: " + product.preco.toFixed(2)} />
                {openModal === "sideBarProduct" && showSideProduct === ind && (
                <SideBarProduct
                    product={product}
                    closeSideBar={() => {
                    close()
                    }}
                />
                )}
            </div>
            ))}
        </section>
        </main>
    )
}

export default Shopping;
