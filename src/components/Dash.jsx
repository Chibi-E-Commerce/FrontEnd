import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, User, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { OrderContext } from '../OrderContext';
import '../styles/components/Dash.css';

export default function Dash({}) {
    const [orders, setOrders] = useState([
        {
          _id: ObjectId('67dd6b50e77b046c4656b353'),
          total: 121.4,
          data: "2025-03-14T03:00:00.000+00:00",
          client: {
            _id: ObjectId('67dd4dfde77b046c4656b352'),
            nome: "Matheus Almeida",
            cpf: "132.323.232-99",
            email: "matheus.almeida@email.com",
            idade: 0,
            endereco: {}
          },
          items: [
            {
              produto: {
                nome: "Sakuragiri",
                descricao: "Onigiri com arroz temperado e toque de cerejeira",
                preco: 24.75,
                marca: "Fujiwara",
                urlImagem: "https://exemplo.com/imagem.png",
                desconto: 0
              },
              quantidade: 5
            }
          ],
          _class: "com.example.Chibi.model.OrderModel"
        },
        // Adding more sample orders for better visualization
        {
          _id: ObjectId('67dd6b50e77b046c4656b354'),
          total: 87.5,
          data: "2025-03-15T14:30:00.000+00:00",
          client: {
            _id: ObjectId('67dd4dfde77b046c4656b353'),
            nome: "Ana Silva",
            email: "ana.silva@email.com",
            idade: 0,
            endereco: {}
          },
          items: [
            {
              produto: {
                nome: "Tamago Sushi",
                descricao: "Sushi com omelete japonês",
                preco: 17.5,
                marca: "Fujiwara",
                desconto: 0
              },
              quantidade: 5
            }
          ]
        },
        {
          _id: ObjectId('67dd6b50e77b046c4656b355'),
          total: 156.8,
          data: "2025-03-16T10:15:00.000+00:00",
          client: {
            _id: ObjectId('67dd4dfde77b046c4656b354'),
            nome: "Carlos Mendes",
            email: "carlos.mendes@email.com",
            idade: 0,
            endereco: {}
          },
          items: [
            {
              produto: {
                nome: "Ramen Tonkotsu",
                descricao: "Ramen tradicional com caldo de porco",
                preco: 39.2,
                marca: "Ichiran",
                desconto: 0
              },
              quantidade: 4
            }
          ]
        }
      ]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    
    // Calculate total sales
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
      
    // Calculate total items sold
    const totalItems = orders.reduce((acc, order) => {
        return acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantidade, 0);
    }, 0);
    
    // Prepare data for the chart
    const chartData = orders.map(order => ({
        name: formatDate(order.data),
        total: order.total,
        items: order.items.reduce((acc, item) => acc + item.quantidade, 0)
    }));

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
                <p className="stat-value">R$ {totalSales.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-info">
                <h3>Itens Vendidos</h3>
                <p className="stat-value">{totalItems}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <h3>Total de Pedidos</h3>
                <p className="stat-value">{orders.length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <User size={24} />
              </div>
              <div className="stat-info">
                <h3>Clientes</h3>
                <p className="stat-value">{new Set(orders.map(order => order.client._id)).size}</p>
              </div>
            </div>
          </div>
          
          <div className="plotting">
            <h2>Visão geral de vendas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
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
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{formatDate(order.data)}</td>
                    <td>{order.client.nome}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          {item.quantidade}x {item.produto.nome}
                        </div>
                      ))}
                    </td>
                    <td>R$ {order.total.toFixed(2)}</td>
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
