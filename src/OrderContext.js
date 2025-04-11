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
      const response = await updateUser(updatedUser);
      return response
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
    let newOrders = [...orders]
    newOrders = newOrders.filter(o => o.produto.id !== order.produto.id);
    syncOrders(newOrders);
  };

  const addOrdersPay = (orders) => {
    localStorage.setItem("ordersPay", JSON.stringify(orders))
  }

  const removeIntersection = () => {
    const ordersPay = JSON.parse(localStorage.getItem("ordersPay")) || [];
    let newOrders = [...orders];
  
    ordersPay.forEach((prevOrder) => {
      newOrders = newOrders.filter(
        (order) => order.produto.id !== prevOrder.produto.id
      );
    });
  
    localStorage.setItem("ordersPay", JSON.stringify([]));
    setOrders(newOrders);
    syncOrders(newOrders)
  
    return newOrders;
  };
  
  

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, addOrdersPay, removeIntersection }}>
      {children}
    </OrderContext.Provider>
  );
};
