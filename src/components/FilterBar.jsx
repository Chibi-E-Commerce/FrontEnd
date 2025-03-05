import { Button, Checkbox } from "./Utils";
import "../styles/components/FilterBar.css"

function FilterBar({addFilter}){

    return(
        <div id="filter-bar">
            <Button text="Mín. Preço" onClick={() => addFilter({tipo:"precoMin", valor:10.00})}/>
            <Button text="Máx. Preço" onClick={() => addFilter({tipo:"precoMax", valor:10.00})}/>
            <Button text="Categorias" onClick={() => addFilter({tipo:"categoria", valor:[], showDrop: "showDrop"})}/>
            <Button text="Desconto" onClick={() => addFilter({tipo:"inDesconto", valor:1})}/>
            <Button text="Marca" onClick={() => addFilter({tipo:"marca", valor:"Swift"})}/>
        </div>
    )
}


export default FilterBar