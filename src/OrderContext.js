import React, { createContext, useState, useEffect, useContext } from 'react';
import { updateUser } from "./api";
import { UserContext } from "./UserContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, addUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.carrinho) {
      setOrders(user.carrinho);
    }
  }, [user]);

  const syncOrders = async (newOrders) => {
    setOrders(newOrders);
    if (user) {
      const updatedUser = { ...user, carrinho: newOrders };
      addUser(updatedUser);
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

  const addOrdersPay = (orders) => {
    localStorage.setItem("ordersPay", JSON.stringify(orders))
  }

  const removeIntersection = () => {
    const ordersPay = JSON.parse(localStorage.getItem("ordersPay")) || [];
  
    ordersPay.forEach((prevOrder) => {
      if (orders.some(o => JSON.stringify(o) === JSON.stringify(prevOrder))) {
        deleteOrder(prevOrder);
      }
    });
  
    localStorage.setItem("ordersPay", JSON.stringify([]));
  };
  

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, addOrdersPay, removeIntersection }}>
      {children}
    </OrderContext.Provider>
  );
};
