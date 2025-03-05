import React, { createContext, useState } from 'react'

export const OrderContext = createContext()

/*
  ** IMPORTANTE **
  É preciso conectar esse Conetxto com a Api, para pegar o que está no carrinho do usuário no banco de dados

  PRECISA ANTES:
   - USER CONTEXT - para conseguir informações do usuário e depois mandar para a API
*/

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [ordersPay, setOrdersPay] = useState([])

  const addOrder = (order) => {
    let cont = 0;
    orders.forEach((prevOrder) => {
      if (JSON.stringify(prevOrder[0]) === JSON.stringify(order[0])){
        prevOrder[1] += order[1]
        cont++
      }
    })
    if (cont === 0){
      setOrders([...orders, order])
    }
  }

  const deleteOrder = (order) => {
    setOrders(orders.filter((cat) => cat !== order))
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
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, ordersPay, setOrdersPay }}>
      {children}
    </OrderContext.Provider>
  )
}