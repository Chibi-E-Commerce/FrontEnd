import React, { createContext, useState } from 'react'

export const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])

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

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  )
}