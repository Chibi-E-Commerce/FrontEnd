import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser, updateUser } from "./api";
import { UserContext } from "./UserContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [ordersPay, setOrdersPay] = useState([])

  useEffect(() => {
    if (user?.carrinho) {
      setOrders(user.carrinho);
    }
  }, [user]);

  const syncOrders = async (newOrders) => {
    setOrders(newOrders);
    if (user) {
      const updatedUser = { ...user, carrinho: newOrders };
      setUser(updatedUser);
      await updateUser(updatedUser);
    }
  };

  const addOrder = (order) => {
    let updatedOrders = [...orders];
    const index = updatedOrders.findIndex(o => JSON.stringify(o.produto) === JSON.stringify(order.produto));
    if (index !== -1) {
      updatedOrders[index].quantidade += order.quantidade;
    } else {
      updatedOrders.push(order);
    }
    syncOrders(updatedOrders);
  };

  const deleteOrder = (order) => {
    const updatedOrders = orders.filter(o => JSON.stringify(o.produto) !== JSON.stringify(order.produto));
    syncOrders(updatedOrders);
  };

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
  );
};
