import carrinhoIcon from "../assets/images/CarIcon.svg"
import deleteP from "../assets/images/DeletarPedido.svg"
import { Imagem, CheckboxManual, Checkbox, Button } from "./Utils"
import "../styles/components/CarSide.css"
import { useContext, useState} from "react"
import { OrderContext } from "../OrderContext"
import { useNavigate } from "react-router-dom"

function CarSide({ closeShowSide }) {
    const orders = useContext(OrderContext).orders
    const {deleteOrder, addOrdersPay} = useContext(OrderContext)
    const [ordersCheckeds, setOrdersCheckeds] = useState([])
    const [checkMain, setCheckMain] = useState(false)
    const nagivate = useNavigate()

    
    const updateOrdersCheckeds = (order) => {
        let updatedOrders
        if (ordersCheckeds.includes(order)) {
            updatedOrders = ordersCheckeds.filter((cat) => cat !== order)
        } else {
            updatedOrders = [...ordersCheckeds, order]
        }

        setOrdersCheckeds(updatedOrders)
    }

    const removeOrder = (order) => {
        if (ordersCheckeds.includes(order)){
            setOrdersCheckeds(ordersCheckeds.filter((cat) => cat !== order))
        }
        deleteOrder(order)
    }

    const updateAllOrdersCheckeds = () => {
        if (checkMain) {
            setOrdersCheckeds([])
        } else {
            setOrdersCheckeds([...orders])
        }
    }

    const updateCheckMain = (e) => {
        setCheckMain(e.target.checked)
        updateAllOrdersCheckeds()
    }

    const sumOrders = () => {
        let total = 0
        let quant = 0
        ordersCheckeds.forEach((order) => {
            total += (order.produto.preco * ((100 - order.produto.desconto)/100)) * order.quantidade
            quant += order.quantidade
        })
        return [total, quant]
    }

    const continuePay = () => {
        if (ordersCheckeds.length > 0){
            addOrdersPay(ordersCheckeds)
            closeShowSide()
            nagivate('/pay')
        }else{
            window.alert("É preciso ter algum produto selecionado no carrinho.")
        }
    }


    return (
        <div id="car-side">
            <div id="header-car-side" className="header-div">
                <h3>Carrinho de Compras</h3>
                <div id="carrinho-icon" onClick={closeShowSide}>
                    <Imagem src={carrinhoIcon} alt="Carrinho" />
                </div>
            </div>

            <ul>
                <li id="header-list">
                    <Checkbox name="all" onChange={updateCheckMain} />
                    <h3>Produtos</h3>
                    <h3>Nome</h3>
                    <h3>P.Ú</h3>
                    <h3>Qntd</h3>
                    <h3>Total</h3>
                </li>

                {orders.map((order, ind) => (
                
                    <li key={ind}>
                        <CheckboxManual
                            name={order.produto.nome}
                            checked={ordersCheckeds.includes(order)}
                            onChange={() => updateOrdersCheckeds(order)}
                        />
                        <div className="image-car-side">
                            <Imagem src={order.produto.urlImagem} />
                        </div>
                        <h3> {order.produto.nome} 
                            <br />
                            <strong>{order.produto.marca}</strong>
                        </h3>
                        <h3>{"R$ " + (order.produto.preco * ((100 - order.produto.desconto)/100)).toFixed(2)}</h3>
                        <h3>{order.quantidade}</h3>
                        <h3>{"R$ " + ((order.produto.preco * ((100 - order.produto.desconto)/100)) * order.quantidade).toFixed(2)}</h3>
                        <Imagem src={deleteP} alt="Deletar item do carrinho" onClick={() => removeOrder(order)}/>
                    </li>
                ))}
            </ul>

            <div id="footer-car-side">
                <div>
                    <h3>{"R$ " + sumOrders()[0].toFixed(2)}</h3>
                    <h4>{"Total de itens: " + sumOrders()[1]}</h4>
                </div>

                <Button text={<h3>CONTINUAR</h3>} onClick={() => continuePay()}/>
            </div>
        </div>
    )
}

export default CarSide
