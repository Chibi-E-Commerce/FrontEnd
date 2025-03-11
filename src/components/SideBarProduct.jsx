import { useState, useContext } from "react";
import { Imagem, Button } from "./Utils";
import add from "../assets/images/filtroAdd.svg";
import remove from "../assets/images/MenosQuantidade.svg";
import car from "../assets/images/CarIconWhite.svg";
import { OrderContext } from "../OrderContext";
import "../styles/components/SideBarProduct.css"

function SideBarProduct({ product, closeSideBar }) {
  const [order, setOrder] = useState({produto: product, quantidade: 1});
  const { addOrder } = useContext(OrderContext);

  const updateAmount = (e, qnt) => {
    let newAmount = e ? Number(e.target.value) : order.quantidade + qnt;
    setOrder((prevOrder) => ({
      produto: prevOrder.produto,
      quantidade: newAmount < 1 ? 1 : newAmount
    }));
  };

  const addProduct = (order) => {
    alert("Adicionou")
    addOrder(order)
    closeSideBar()
  }

  return (
    <div id="sidebar-product" onClick={(e) => e.stopPropagation()}>
      <div id="image-sidebar-product">
        <Imagem src={product.urlImagem} alt={product.nome} />
      </div>
      <div id="text">
        <h3>{product.nome}</h3>
        <h5>{product.marca}</h5>
        <p>{product.descricao}</p>
      </div>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <Button text={<Imagem src={remove} />} onClick={() => updateAmount(undefined, -1)} />
          <input type="number" name="qnt" value={order.quantidade} onChange={updateAmount} />
          <Button id="btn-right" text={<Imagem src={add} />} onClick={() => updateAmount(undefined, 1)} />
        </form>
        <Button text={<><Imagem src={car} /><p>Adicionar ao Carrinho</p></>} onClick={() => addProduct(order)} />
      </div>
    </div>
  );
}

export default SideBarProduct;
