import {Imagem, Button} from "../components/Utils"
import filtroDelete from "../assets/images/filtroDelete.svg"
import filtroAdd from "../assets/images/filtroAdd.svg"
import filtroRetirar from "../assets/images/filtroRetirar.svg"
import filtroSearch from "../assets/images/filtroSearch.svg"
import "../styles/Shopping.css"
import { useState } from "react"
import FilterBar from "../components/FilterBar"
import SideBarProduct from "../components/SideBarProduct"

function Shopping({products}) {
    
    const [showSideFilter, setShowSideFilter] = useState(false)
    const [showSideProduct, setShowSideProduct] = useState(null)
    const [filters, setFilters] = useState([])

    const addFilter = (filter) => {
        let cont = 0
        filters.forEach(filterOld => {
            if (filterOld.tipo === filter.tipo){
                cont++
            }
        })
        if (cont==0){
            setFilters([...filters, filter])
        }
    };

    const colorLi = (filter) => {
        if (filter.tipo === "Máx") {
            return "#F0CF7F";
        } else if (filter.tipo === "Mín") {
            return "#F05F4B";
        } else if (filter.tipo === "Marca") {
            return "#F0C04B";  
        } else if (filter.tipo === "Categorias") {
            return "#F0E04B";
        } else if (filter.tipo === "Desconto") {
            return "#F09F4B";
        } else {
            return "#CCCCCC";
        }
    };

    const removeAllFilters = () => {
        setFilters([])
    }

    const removeFilter = (filterRemove) => {
        setFilters((filtersPrev) => {
            return filtersPrev.filter(filter => filter !== filterRemove)
        })
    } 

    const updateValueFilter = (e) => {
        filters.forEach(filter => {
            if (e.target.name === filter.tipo){
                filter.valor = e.target.value
            }
        })
    
        setShowSideFilter(false);
    };
    

    return(
        <main>
            <section id="filtro">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div id="search-filtro">
                        <input type="text" name="search" placeholder="Pesquisar produto" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                        <div><Imagem src={filtroSearch} alt="Procura produto"/></div>
                    </div>

                    <div>
                        <div id="header-filtro">
                            <h3>Filtro</h3>
                            <div id="header-icons">
                                <Imagem src={filtroDelete} alt="Deletar filtro" onClick={() => {removeAllFilters()}}/>
                                <Imagem src={filtroAdd} alt="Adicionar filtro" onClick={() => {setShowSideFilter(!showSideFilter)}}/>
                            </div>
                        </div>

                        <ul>
                            {
                                filters.map((filter, ind) => (
                                    <li key={ind} style={{backgroundColor: colorLi(filter)}}>
                                        <div className="image-remove" onClick={() => removeFilter(filter)}>
                                            <Imagem src={filtroRetirar} alt="Retirar filtro"/>
                                        </div>
                                        {
                                            filter.tipo === "Mín" || filter.tipo === "Máx" ?
                                            (
                                                <>
                                                    <label htmlFor={filter.tipo}>{filter.tipo +": "}</label>
                                                    <input type="number" name={filter.tipo} placeholder={filter.valor} onChange={updateValueFilter}/>
                                                </>
                                            )
                                            :
                                            filter.tipo === "Marca" ?
                                            (
                                                <>
                                                    <label htmlFor={filter.tipo}>{filter.tipo +": "}</label>
                                                    <input type="text" name={filter.tipo} placeholder={filter.valor} onChange={updateValueFilter}/>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <p>{filter.tipo}</p>
                                                    <p>{filter.valor}</p>
                                                </>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    {showSideFilter && <FilterBar addFilter={addFilter}/>}
                </form>
            </section>
            <section>
                {
                    products.map((product, ind) => (
                        <div key={ind} className="product" onClick={() => setShowSideProduct(showSideProduct === ind ? null : ind)}>
                            <div>
                                <Imagem src={product.urlImagem} alt={product.nome}/>
                            </div>
                            <h3>{product.nome}</h3>
                            <p>{product.marca}</p>

                            <Button text={"R$: "+ product.preco.toFixed(2)}/>
                            {showSideProduct === ind && <SideBarProduct product={product}/>}
                        </div>
                    ))
                }
            </section>
        </main>
    )
}

export default Shopping;