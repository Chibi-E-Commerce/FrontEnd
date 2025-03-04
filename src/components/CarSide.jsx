import carrinhoIcon from "../assets/images/CarIcon.svg"
import deleteP from "../assets/images/DeletarPedido.svg"
import { Imagem, CheckboxManual, Checkbox, Button } from "./Utils"
import "../styles/components/CarSide.css"
import { useContext, useState} from "react"
import { OrderContext } from "../OrderContext"
import { useModal } from "../ModalContext"

function CarSide({ closeShowSide }) {
    const orders = useContext(OrderContext).orders
    const {deleteOrder} = useContext(OrderContext)
    const [ordersCheckeds, setOrdersCheckeds] = useState([])
    const [checkMain, setCheckMain] = useState(false)

    const updateOrdersCheckeds = (order) => {
        let updatedOrders
        if (ordersCheckeds.includes(order)) {
            updatedOrders = ordersCheckeds.filter((cat) => cat !== order)
        } else {
            updatedOrders = [...ordersCheckeds, order]
        }

        setOrdersCheckeds(updatedOrders)
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
            total += order[0].preco * order[1]
            quant += order[1]
        })
        return [total, quant]
    }

    return (
        <div id="car-side">
            <div id="header-car-side">
                <h3>Carrinho de Compras</h3>
                <div id="carrinho-icon" onClick={closeShowSide}>
                    <Imagem src={carrinhoIcon} alt="Carrinho" />
                </div>
            </div>

            <ul>
                <li id="header-list">
                    <Checkbox name="all" onChange={updateCheckMain} />
                    <h3>Produtos</h3>
                    <h3>Preço Único</h3>
                    <h3>Quantidade</h3>
                    <h3>Total</h3>
                </li>

                {orders.map((order, ind) => (
                    <li key={ind}>
                        <CheckboxManual
                            name={order[0].nome}
                            checked={ordersCheckeds.includes(order)}
                            onChange={() => updateOrdersCheckeds(order)}
                        />
                        <div className="image-car-side">
                            <Imagem src={order[0].urlImagem} />
                        </div>
                        <h3>{"R$ " + order[0].preco.toFixed(2)}</h3>
                        <h3>{order[1]}</h3>
                        <h3>{"R$ " + (order[0].preco * order[1]).toFixed(2)}</h3>
                        <Imagem src={deleteP} alt="Deletar item do carrinho" onClick={() => deleteOrder(order)}/>
                    </li>
                ))}
            </ul>

            <div id="footer-car-side">
                <div>
                    <h3>{"R$ " + sumOrders()[0].toFixed(2)}</h3>
                    <h4>{"Total de itens: " + sumOrders()[1]}</h4>
                </div>

                <Button text={<h3>CONTINUAR</h3>} />
            </div>
        </div>
    )
}

export default CarSide
