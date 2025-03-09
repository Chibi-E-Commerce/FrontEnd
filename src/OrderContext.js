import axios from 'axios'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { UserContext } from './UserContext'

export const OrderContext = createContext()

/*
  ** IMPORTANTE **
  É preciso conectar esse Conetxto com a Api, para pegar o que está no carrinho do usuário no banco de dados

  PRECISA ANTES:
   - USER CONTEXT - para conseguir informações do usuário e depois mandar para a API
*/

export const OrderProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  const [ordersPay, setOrdersPay] = useState([])

  const sSendOrder = async () => {      
    console.log(user)
    let e = await axios.put('http://localhost:8080/cliente', user, {
      params: {
        email: user.email
      }
    });
  } 

  const updateOrderWithApi = () => {
    try {
      user.carrinho = orders;
      console.log(user);
      sSendOrder()
    } catch (e) {
      console.log('Não conseguiu atualizar carrinho.');
    }
  }

  const addOrder = (order) => {
    let cont = 0;
    orders.forEach((prevOrder) => {
      if (JSON.stringify(prevOrder.produto) === JSON.stringify(order.produto)){
        prevOrder.quantidade += order.quantidade
        cont++
      }
    })
    if (cont === 0){
      setOrders([...orders, order])
    }

    updateOrderWithApi();
  }

  const deleteOrder = (order) => {
    setOrders(orders.filter((cat) => cat !== order))

    updateOrderWithApi();
  }


  // Essa Função serve para retirar do carrinho os produtos pagos.
  const removeIntersection = () => {
    ordersPay.forEach((prevOrder) => {
      if (orders.includes(prevOrder)){
        deleteOrder(prevOrder)
      }
    })
  }

  return (
    <OrderContext.Provider value={{ orders, setOrders, addOrder, deleteOrder, ordersPay, setOrdersPay }}>
      {children}
    </OrderContext.Provider>
  )
}