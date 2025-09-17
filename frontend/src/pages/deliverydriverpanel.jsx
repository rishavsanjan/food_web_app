import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, DollarSign, Star, Navigation, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const DeliveryDriverPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [earnings, setEarnings] = useState({
    today: 128.50,
    week: 892.30,
    month: 3567.80,
    rating: 4.8,
    completedDeliveries: 47
  });
  const [orders, setOrders] = useState([]);


  const getDriverProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: 'http://localhost:3000/api/users/profile',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    console.log(response.data);
  }

  const getOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: 'http://localhost:3000/api/agent/getorders',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    setOrders(response.data.orders);

    console.log(response.data)
  }

  useEffect(() => {
    getOrders();
    getDriverProfile();
  }, [])


  const updateOrderStatus = (orderId, newStatus) => {
    setActiveOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-blue-500';
      case 'pickup': return 'bg-orange-500';
      case 'delivering': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    return priority === 'urgent' ? (
      <AlertCircle className="w-4 h-4 text-red-400" />
    ) : null;
  };

  const totalPrice = (order) => {
    let total = 0;
    order.map((dish) => {
      total += parseInt(dish.total_price)
    })

    return total;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitEats Driver</h1>
                <p className="text-sm text-purple-200">Welcome back, Alex!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
              { id: 'orders', label: 'Active Orders', icon: Package },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-orange-400 text-orange-400'
                    : 'border-transparent text-purple-200 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Earnings Overview */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Today's Earnings</p>
                    <p className="text-3xl font-bold text-white">${earnings.today}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Weekly Earnings</p>
                    <p className="text-3xl font-bold text-white">${earnings.week}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Monthly Earnings</p>
                    <p className="text-3xl font-bold text-white">${earnings.month}</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold text-white">{earnings.rating}</p>
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Stats */}
            {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Today's Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-orange-500/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                    <Package className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{earnings.completedDeliveries}</p>
                  <p className="text-purple-200">Completed Deliveries</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                    <Clock className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">8.5h</p>
                  <p className="text-purple-200">Hours Online</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                    <Navigation className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">127 km</p>
                  <p className="text-purple-200">Distance Traveled</p>
                </div>
              </div>
            </div> */}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Active Orders</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-purple-200 text-sm">
                  {orders.filter(order => order.delivery_status !== 'delivered').length} active orders
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(order?.order?.status)}`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white">{order.order_id}</h3>
                          {getPriorityIcon(order.priority)}
                        </div>
                        <p className="text-purple-200 text-sm capitalize">{order?.order?.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">₹{totalPrice(order.orders.order_details)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-purple-200 text-sm font-medium mb-1">Restaurant</p>
                      <p className="text-white">{order?.orders.restaurant?.restaurant_name}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm font-medium mb-1">Customer</p>
                      <p className="text-white">{order?.orders?.users?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <p className="text-purple-200 text-sm">{order?.orders?.users?.address}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Package className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-white font-medium">{order?.orders?.order_details.length}</p>
                      <p className="text-purple-200 text-xs">Items</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Navigation className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-white font-medium">{order?.distance || '5KM'}</p>
                      <p className="text-purple-200 text-xs">Distance</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                      <p className="text-white font-medium">{order?.estimatedTime || '25 Mins'}</p>
                      <p className="text-purple-200 text-xs">ETA</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Navigation className="w-4 h-4" />
                      <span>Navigate</span>
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>

                    {order.orders.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'pickup')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Mark Picked Up</span>
                      </button>
                    )}

                    {order.orders.status === 'Out_for_Delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Food Icons */}
      <div className="fixed top-20 right-10 animate-bounce">
        <div className="text-4xl opacity-30">🍕</div>
      </div>
      <div className="fixed top-40 left-10 animate-bounce" style={{ animationDelay: '1s' }}>
        <div className="text-4xl opacity-30">🍔</div>
      </div>
      <div className="fixed bottom-20 right-20 animate-bounce" style={{ animationDelay: '2s' }}>
        <div className="text-4xl opacity-30">🥗</div>
      </div>
    </div>
  );
};

export default DeliveryDriverPanel;