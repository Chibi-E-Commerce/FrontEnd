import {Imagem, Button} from "../components/Utils"
import add from "../assets/images/filtroAdd.svg"
import remove from "../assets/images/filtroRetirar.svg"
import carrinhoIcon from "../assets/images/CarIcon.svg"
import "../styles/components/SideBarProduct.css"

function SideBarProduct({product}) {
    return(
        <div id="sidebar-product">
            <div id="image-sidebar-product">
                <Imagem src={product.urlImagem} alt={product.nome}/>
            </div>
            <h3>{product.nome}</h3>
            <p>{product.marca}</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <Button text={<Imagem src={remove}/>} onClick=""/>
                <input type="number"/>
                <Button text={<Imagem src={add}/>} onClick=""/>
            </form>
            <Button text={<><Imagem src={carrinhoIcon}/><p>Adicionar ao Carrinho</p></>} onClick=""/>
        </div>
    )
}

export default SideBarProduct