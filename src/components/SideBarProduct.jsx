import { useState, useContext } from "react"
import {Imagem, Button} from "./Utils"
import add from "../assets/images/filtroAdd.svg"
import remove from "../assets/images/MenosQuantidade.svg"
import car from "../assets/images/CarIconWhite.svg"
import "../styles/components/SideBarProduct.css"
import { OrderContext } from "../OrderContext"

function SideBarProduct({product, closeSideBar}) {

    const [order, setOrder] = useState([product, 1])
    const { addOrder } = useContext(OrderContext)

    const handleClick = (e) => {
        e.stopPropagation()
    }

    const updateAmount = (e, qnt) => {
        setOrder((prevOrder) => {
            let newAmount = e ? Number(e.target.value) : prevOrder[1] + qnt
            if (newAmount < 1) newAmount = 1
            return [prevOrder[0], newAmount]
        })
    }

    const addProductCar = () => {
        window.alert("Produto adiciondo")
        addOrder(order)
        closeSideBar()
    }


    return(
        <div id="sidebar-product" onClick={handleClick}>
            <div id="image-sidebar-product">
                <Imagem src={product.urlImagem} alt={product.nome}/>
            </div>
            <h3>{product.nome}</h3>
            <h5>{product.marca}</h5>
            <p>{product.descricao}</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <Button text={<Imagem src={remove}/>} onClick={() => updateAmount(undefined, -1)}/>
                <input type="number" name="qnt" value={order[1]} onChange={updateAmount}/>
                <Button id="btn-right" text={<Imagem src={add}/>} onClick={() => updateAmount(undefined, 1)}/>
            </form>
            <Button id="btn-add" text={<><Imagem src={car} /><p>Adicionar ao Carrinho</p></>} onClick={() => {addProductCar()}}/>
        </div>
    )
}

export default SideBarProduct