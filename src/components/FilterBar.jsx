import { Button } from "./Utils";
import "../styles/components/FilterBar.css"

function FilterBar({addFilter}){

    return(
        <div id="filter-bar">
            <Button text="Mín. Preço" onClick={() => addFilter({tipo:"Mín", valor:"10,00"})}/>
            <Button text="Máx. Preço" onClick={() => addFilter({tipo:"Máx", valor:"10,00"})}/>
            <Button text="Categorias" onClick={() => addFilter({tipo:"Categorias", valor:""})}/>
            <Button text="Desconto" onClick={() => addFilter({tipo:"Desconto", valor:""})}/>
            <Button text="Marca" onClick={() => addFilter({tipo:"Marca", valor:"Swift"})}/>
        </div>
    )
}

export default FilterBar