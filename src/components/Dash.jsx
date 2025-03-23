import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, User, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { OrderContext } from '../OrderContext';
import '../styles/components/Dash.css';
import api from '../api';


const getPedidos = async () => {
    try {
        const response = await api.get('/pedido/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        return null;
    }
};

export default function Dash({}) {
    const [pedidos, setPedidos] = useState([])
    const [dashData, setDashData] = useState({
        totalSales: 0,
        totalItems: 0,
        totalClients: 0,
        chartData: []
    })
    
    const getPedidosAsync = async () => {
        try {
            const pedidos = await getPedidos();
            if (pedidos) {
                setPedidos(pedidos);
            } else {
                console.warn('No orders received');
                setPedidos([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setPedidos([]);
        }
    }

    const getDashData = () => {
      if (pedidos.length === 0) {
          return
      }

      // Calculate total sales
      const totalSales = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
        
      // Calculate total items sold
      const totalItems = pedidos.reduce((acc, pedido) => {
          return acc + pedido.itens?.reduce((itemAcc, item) => itemAcc + (item.quantidade || 0), 0);
      }, 0);

      
      // Prepare data for the chart
      const chartData = pedidos.map(pedido => ({
          name: formatDate(pedido.data),
          total: pedido.total,
          items: pedido.itens?.reduce((acc, item) => acc + (item.quantidade || 0), 0)
      }));

      const totalClients = [...new Set(pedidos.map(pedido => pedido.client.nome).filter(x => x))].length;
      
      setDashData({ totalSales, totalItems, totalClients, chartData });
    }
      
    useEffect(() => {
      getPedidosAsync();
    }, [])

    useEffect(() => {
      getDashData();
    }, [pedidos])

    /**
     * Given a date string in ISO format, returns the date in the
     * format 'dd/MM/yyyy' as a string.
     * @param {string} dateString - The date string to format
     * @returns {string} The formatted date string
     */

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className='dash'>
        <div className="basic-info-row">
          <div className="overview">
            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <h3>Vendas Totais</h3>
                <p className="stat-value">R$ {dashData.totalSales.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-info">
                <h3>Itens Vendidos</h3>
                <p className="stat-value">{dashData.totalItems}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <h3>Total de Pedidos</h3>
                <p className="stat-value">{pedidos.length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <User size={24} />
              </div>
              <div className="stat-info">
                <h3>Clientes</h3>
                <p className="stat-value">{dashData.totalClients}</p>
              </div>
            </div>
          </div>
          
          <div className="plotting">
            <h2>Visão geral de vendas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#F05F4B" />
                <YAxis yAxisId="right" orientation="right" stroke="#AB886D" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="total" name="Valor (R$)" fill="#F05F4B" />
                <Bar yAxisId="right" dataKey="items" name="Itens" fill="#AB886D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="recent">
          <h2>Pedidos Recentes</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedidos) => (
                  <tr key={pedidos._id}>
                    <td>{formatDate(pedidos.data)}</td>
                    <td>{pedidos.client.nome}</td>
                    <td>
                      {pedidos.itens?.map((item, index) => (
                        <div key={index} className="order-item">
                          {item.quantidade}x {item.produto.nome}
                        </div>
                      ))}
                    </td>
                    <td>R$ {pedidos.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}

function ObjectId(id) {
  return id;
}
