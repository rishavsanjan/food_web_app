import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, MapPin, Clock, DollarSign, Star, Navigation, Phone, MessageCircle, CheckCircle, AlertCircle, History, Clock1, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import OrderNotificationOverlay from './order-emit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this CSS is imported
import config from '../config/config';


const DeliveryDriverPanel = () => {
  const socket = useMemo(() => io(`${config.apiUrl}`), []);
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [earnings, setEarnings] = useState({
    today: 128.50,
    week: 892.30,
    month: 3567.80,
    rating: 4.8,
    completedDeliveries: 47
  });
  const [activeOrders, setOrders] = useState([]);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [riderOrderModal, setRiderOrderModal] = useState(false);

  const showOrderAlreadyAccepted = useCallback(() => {
    toast.warn('Order already accepted', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const showNewOrderToast = useCallback(() => {
    toast.info('New order request received!', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  }, []);

  const getDriverProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `${config.apiUrl}/api/users/profile`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    setUser(response.data.user);
    console.log(response.data);
  }

  const getOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `${config.apiUrl}/api/agent/getorders`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    setOrders(response.data.orders);
    const res = await axios({
      url: `${config.apiUrl}/api/agent/getorderHistory`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    setHistory(res.data.orders);

    console.log(response.data)
  }

  useEffect(() => {
    getOrders();
    getDriverProfile();
  }, []);

  useEffect(() => {
    if (user?.role === "DELIVERY_AGENT") {
      socket.emit('delivery_partner_online', {
        driverId: user.user_id,
        driverCity: user.city
      });
    }
  }, [user, socket]);

  useEffect(() => {
    const handleNewOrderRequest = ({ orderDetails, order, user, restaurant }) => {
      console.log('New order received:', orderDetails);

      // Show toast immediately
      showNewOrderToast();

      setIncomingOrder({ orderDetails, order, user, restaurant });
      setRiderOrderModal(true);
    };

    const handleOrderAlreadyAccepted = () => {
      console.log('Order already accepted');
      setRiderOrderModal(false);

      // Show toast immediately without setTimeout
      showOrderAlreadyAccepted();
    };

    // Add event listeners
    socket.on('new_order_request', handleNewOrderRequest);
    socket.on('order_already_accepted', handleOrderAlreadyAccepted);

    // Cleanup function
    return () => {
      socket.off('new_order_request', handleNewOrderRequest);
      socket.off('order_already_accepted', handleOrderAlreadyAccepted);
    };
  }, [socket, showNewOrderToast, showOrderAlreadyAccepted]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${config.apiUrl}/api/agent/change-order-status`,
        method: 'patch',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        data: {
          order_id: orderId,
          status: newStatus
        }
      });

      console.log(response.data);

      // Show success toast
      toast.success(`Order status updated to ${newStatus}`, {
        position: "top-center",
        autoClose: 2000,
      });

      setOrders(prev =>
        prev.map((item) => {
          if (item.order_id === orderId) {
            return {
              ...item,
              orders: {
                ...item.orders,
                status: newStatus
              }
            }
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status', {
        position: "top-center",
        autoClose: 3000,
      });
    }
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

  function convertToCustomDateTime(isoString) {
    const date = new Date(isoString);

    // Get the date components
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Array of month names
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Get the month name
    const monthName = months[date.getMonth()];

    // Return the formatted string: "15 August 2025, 13:52:13"
    return `${day} ${monthName} ${year}, ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />

      {riderOrderModal && incomingOrder && (
        <OrderNotificationOverlay
          driver={user}
          orderDetails={incomingOrder.orderDetails}
          order={incomingOrder.order}
          user={incomingOrder.user}
          restaurant={incomingOrder.restaurant}
          onClose={() => setRiderOrderModal(false)}
        />
      )}
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
                <p className="text-sm text-purple-200">Welcome back, {user.name}</p>
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
              { id: 'dashboard', label: 'Dashboard', icon: IndianRupee },
              { id: 'orders', label: 'Active Orders', icon: Package },
              { id: 'history', label: 'History', icon: History },
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
            {/* Dashboard content commented out as in original */}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Active Orders</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-purple-200 text-sm">
                  {activeOrders.filter(order => order.delivery_status !== 'delivered').length} active orders
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {
                activeOrders.length === 0 &&
                <div className='items-center flex justify-center mt-48'>
                  <h1 className='text-4xl text-purple-400'>There are no active orders!</h1>
                </div>
              }
              {activeOrders.map((order) => (
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
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock1 className="w-4 h-4 text-purple-400" />
                    <p className="text-md  text-white">{convertToCustomDateTime(order.orders.order_time)}</p>
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

                    {order.orders.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.order_id, 'picked_up')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Mark Picked Up</span>
                      </button>
                    )}

                    {(order.orders.status === 'Out_for_Delivery' || order.orders.status === 'picked_up') && (
                      <button
                        onClick={() => updateOrderStatus(order.order_id, 'delivered')}
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
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Past Orders</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-purple-200 text-sm">
                  {history.length} total orders
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {
                history.length === 0 &&
                <div className='items-center flex justify-center mt-48'>
                  <h1 className='text-4xl text-purple-400'>There are no past orders!</h1>
                </div>
              }
              {history.map((order) => (
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
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock1 className="w-4 h-4 text-purple-400" />
                    <p className="text-md  text-white">{convertToCustomDateTime(order.orders.order_time)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 ">
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