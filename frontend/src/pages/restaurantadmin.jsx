import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Store,
  ChefHat,
  DollarSign,
  Star,
  Eye,
  EyeOff,
  Camera,
  Settings,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  ShoppingBag
} from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DeleteConfirmationModal from '../models/deleteConfirmationRestAdmin';
import loadingAnimation from '../../assets/loading-animation/pac_buffer.json';
import Lottie from "lottie-react";


export default function RestaurantAdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [menu, setMenu] = useState([]);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    cholesterol: '',
    image: null,
    availability: true
  });
  const [restaurant, setRestaurant] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);


  const getDetails = async () => {
    const token = localStorage.getItem('token');

    const response = await axios({
      url: `http://localhost:3000/api/rest/menu`,
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    console.log(response.data)
    setMenu(response.data.menus);
    setRestaurant(response.data.restaurant);
    setLoading(false);
  }

  const getOrders = async () => {
    const token = localStorage.getItem('token');

    const response = await axios({
      url: `http://localhost:3000/api/rest/orders`,
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })

    console.log(response.data)

    setOrders(response.data.orders)
  }

  

  useEffect(() => {
    getOrders();
    getDetails();
  }, [])


  const categories = ['veg', 'non_veg'];

  const resetForm = () => {
    setNewDish({
      menu_id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      cholesterol: '',
      image: null,
      availability: true
    });
    setShowAddDishModal(false);
    setEditingDish(null);
  };

  const handleAddDish = async () => {

    const token = localStorage.getItem('token');
    const response = await axios({
      url: `http://localhost:3000/api/rest/addMenu`,
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        menu_name: newDish.name,
        description: newDish.description,
        price: parseFloat(newDish.price) || 0,
        category: newDish.category || 'veg',
        calories: parseInt(newDish.calories) || 0,
        protein: parseInt(newDish.protein) || 0,
        carbohydrates: parseInt(newDish.carbs) || 0,
        fat: parseInt(newDish.fat) || 0,
        fiber: parseInt(newDish.fiber) || 0,
        cholesterol: parseInt(newDish.cholesterol) || 0,
        image: newDish.image || '🍽️',
        availability: newDish.availability
      }
    })
    console.log(response.data);

    const dishToAdd = {
      menu_name: newDish.name,
      description: newDish.description,
      price: parseFloat(newDish.price) || 0,
      category: newDish.category,
      calories: parseInt(newDish.calories) || 0,
      protein: parseInt(newDish.protein) || 0,
      carbohydrates: parseInt(newDish.carbs) || 0,
      fat: parseInt(newDish.fat) || 0,
      fiber: parseInt(newDish.fiber) || 0,
      cholesterol: parseInt(newDish.cholesterol) || 0,
      image: newDish.image || '🍽️',
    };

    setMenu([...menu, dishToAdd]);
    resetForm();
    toast.success('Dish added successfully!');
  };

  const handleEditDish = async (dish) => {
    console.log(dish)
    setEditingDish(dish);
    setNewDish({
      menu_id: dish.menu_id,
      name: dish.menu_name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbohydrates,
      fat: dish.fat,
      fiber: dish.fiber,
      cholesterol: dish.cholesterol,
      image: dish.image,
      availability: dish.availability
    });
    setShowAddDishModal(true);

  };

  const handleUpdateDish = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `http://localhost:3000/api/rest/menuUpdate`,
      method: 'patch',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        menu_id: parseInt(newDish.menu_id),
        name: newDish.menu_name,
        description: newDish?.description || "",
        price: parseInt(newDish.price),
        category: newDish.category,
        calories: newDish.calories,
        protein: parseInt(newDish.protein),
        carbs: newDish.carbohydrates,
        fat: parseInt(newDish.fat),
        fiber: parseInt(newDish.fiber),
        cholesterol: parseInt(newDish.cholesterol),
        image: newDish?.image || "",
        availability: newDish.availability
      }
    })

    const updatedDish = {
      ...editingDish,
      menu_name: newDish.name,
      description: newDish.description,
      price: parseFloat(newDish.price) || 0,
      category: newDish.category,
      calories: parseInt(newDish.calories) || 0,
      protein: parseInt(newDish.protein) || 0,
      carbohydrates: parseInt(newDish.carbs) || 0,
      fat: parseInt(newDish.fat) || 0,
      fiber: parseInt(newDish.fiber) || 0,
      cholesterol: parseInt(newDish.cholesterol) || 0,
      image: newDish.image,
      availability: newDish.availability
    };

    setMenu(menu.map(d => d.menu_id === editingDish.menu_id ? updatedDish : d));
    resetForm();
    toast.success('Dish Updated Successfully!');
  };

  const handleDeleteDish = (dish) => {
    setDeleteSelected(dish);
    setDeleteModal(true);
  };

  const toggleDishAvailability = async (dishId, availability) => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `http://localhost:3000/api/rest/menuUpdate`,
      method: 'patch',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        menu_id: dishId,
        availability: !availability
      }
    })


    setMenu(menu.map(dish =>
      dish.menu_id === dishId
        ? { ...dish, availability: !dish.availability }
        : dish
    ));
    if (availability) {
      toast.success('Not-Available now!', {
        autoClose: 2000
      });
    } else {
      toast.success('Available now!', {
        autoClose: 2000
      });
    }
  };

  const handleSubmit = () => {
    if (editingDish) {
      handleUpdateDish();
    } else {
      handleAddDish();
    }
  };

  // Order status functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <AlertCircle className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const OrderCard = ({ order }) => (
    <div className="bg-transparent bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white text-lg font-semibold">#{order.id}</h3>
            <span className={`px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-purple-200 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{order.customerPhone}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-green-400 text-xl font-bold">₹{order.totalAmount}</div>
          <div className="text-purple-200 text-sm">{order.orderTime}</div>
          <div className="text-orange-400 text-sm font-medium">{order.estimatedTime}</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-transparent bg-opacity-10 rounded-lg p-3 border border-white border-opacity-10">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {item.quantity}
              </span>
              <span className="text-white">{item.name}</span>
            </div>
            <span className="text-green-400 font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 py-2 px-4 rounded-lg font-medium transition-all duration-200">
          Accept
        </button>
        <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-2 px-4 rounded-lg font-medium transition-all duration-200">
          Mark Ready
        </button>
        <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-all duration-200">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen backdrop-blur-md bg-purple-500/30 flex-col ">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
        <h1 className='text-xl font-semibold'>Loading Restaurant Details...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
        {/* Header */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="bg-transparent bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Restaurant Dashboard</h1>
                  <p className="text-purple-200">{restaurant.restaurant_name}</p>
                </div>
              </div>

              <button className="text-purple-200 hover:text-white transition-colors duration-200">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Dishes</p>
                  <p className="text-2xl font-bold text-white">{menu.length}</p>
                </div>
                <ChefHat className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Available</p>
                  <p className="text-2xl font-bold text-white">{menu.filter(d => d?.availability)?.length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Avg Price</p>
                  <p className="text-2xl font-bold text-white">
                    ₹{menu.length > 0 ? (menu.reduce((sum, dish) => sum + dish?.price, 0) / menu?.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Rating</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    {restaurant?.rating} <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'menu' 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                  : 'bg-transparent bg-opacity-10 border border-white border-opacity-20 text-purple-200 hover:text-white'
              }`}
            >
              <ChefHat className="w-5 h-5" />
              Menu Management
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'orders' 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                  : 'bg-transparent bg-opacity-10 border border-white border-opacity-20 text-purple-200 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Current Orders
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {orders.filter(o => o.status !== 'completed').length}
              </span>
            </button>
          </div>

          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl border border-white border-opacity-20 overflow-hidden">
              <div className="p-6 border-b border-white border-opacity-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <ChefHat className="h-6 w-6 mr-3" />
                    Menu Management
                  </h2>
                  <button
                    onClick={() => setShowAddDishModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Dish
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {menu.map((dish) => (
                    <div key={dish?.menu_id} className="bg-transparent bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="text-4xl">{dish?.image}</div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{dish?.menu_name}</h3>
                              <span className="bg-orange-500 bg-opacity-20 text-orange-300 px-3 py-1 rounded-full text-sm">
                                {dish?.category}
                              </span>

                            </div>

                            <p className="text-purple-200 mb-3">{dish?.description}</p>

                            <div className="flex items-center space-x-6 text-sm">
                              <span className="text-green-400 font-bold text-lg">₹{dish?.price}</span>
                              <span className="text-purple-300">{dish?.calories} cal</span>
                              <span className="text-purple-300">{dish?.protein}g protein</span>
                              <span className="text-purple-300">{dish?.carbohydrates}g carbs</span>
                              <span className="text-purple-300">{dish?.fat}g fat</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDishAvailability(dish?.menu_id, dish?.availability)}
                            className={`p-2 rounded-lg transition-all duration-200 ${dish?.availability
                              ? 'bg-green/20 text-green-400 hover:bg-opacity-30'
                              : 'bg-red/20 text-red-400 hover:bg-opacity-30'
                              }`}
                          >
                            {dish?.availability ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => handleEditDish(dish)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteDish(dish)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShoppingBag className="h-6 w-6 mr-3" />
                  Current Orders
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm rounded-full">
                    Pending: {orders.filter(o => o.status === 'pending').length}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded-full">
                    Preparing: {orders.filter(o => o.status === 'preparing').length}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded-full">
                    Ready: {orders.filter(o => o.status === 'ready').length}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-6">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="bg-transparent bg-opacity-5 rounded-2xl p-12 border border-white border-opacity-10 text-center">
                    <ShoppingBag className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
                    <p className="text-purple-200">New orders will appear here when customers place them.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dish Modal */}
        {showAddDishModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingDish ? 'Edit Dish' : 'Add New Dish'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-purple-300 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Dish Name</label>
                    <input
                      type="text"
                      value={newDish.name}
                      onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white placeholder-purple-200"
                      placeholder="Enter dish name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Price ₹</label>
                    <input
                      type="number"
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                      className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white placeholder-purple-200"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    rows="3"
                    className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white placeholder-purple-200"
                    placeholder="Describe your dish..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-purple-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nutrition Info */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Nutritional Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Calories</label>
                      <input
                        type="number"
                        value={newDish.calories}
                        onChange={(e) => setNewDish({ ...newDish, calories: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Protein (g)</label>
                      <input
                        type="number"
                        value={newDish.protein}
                        onChange={(e) => setNewDish({ ...newDish, protein: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Carbohydrates (g)</label>
                      <input
                        type="number"
                        value={newDish.carbs}
                        onChange={(e) => setNewDish({ ...newDish, carbs: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Fat (g)</label>
                      <input
                        type="number"
                        value={newDish.fat}
                        onChange={(e) => setNewDish({ ...newDish, fat: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Fiber (g)</label>
                      <input
                        type="number"
                        value={newDish.fiber}
                        onChange={(e) => setNewDish({ ...newDish, fiber: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Cholesterol (g)</label>
                      <input
                        type="number"
                        value={newDish.cholesterol}
                        onChange={(e) => setNewDish({ ...newDish, cholesterol: e.target.value })}
                        className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-purple-200"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">Dish Image</label>
                  <div className="bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-xl p-6 text-center">
                    <div className="text-6xl mb-4">{newDish.image || '🍽️'}</div>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center mx-auto"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Image
                    </button>
                    <p className="text-purple-200 text-sm mt-2">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Available for orders</label>
                  <button
                    type="button"
                    onClick={() => setNewDish({ ...newDish, availability: !newDish.availability })}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${newDish.availability ? 'bg-green-400' : 'bg-gray-400'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${newDish.availability ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {editingDish ? 'Update Dish' : 'Add Dish'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-transparent bg-opacity-10 border border-white border-opacity-30 text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {
        deleteModal &&
        <>
          <DeleteConfirmationModal deleteSelected={deleteSelected} setDeleteModal={setDeleteModal} setMenu={setMenu} />
        </>
      }
    </>

  );
}