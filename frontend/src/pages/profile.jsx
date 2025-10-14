import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, Heart, Clock, Star, LogOut, Package, Calendar, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import config from '../config/config';


export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: ''
    });

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged Out Successfully!');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/users/profile`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setUserData(response.data.user);
    }

    const getOrder = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/order/list`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setOrders(response.data.orders);
    }

    useEffect(() => {
        getProfile();
        getOrder();
    }, [])

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios({
                url: `${config.apiUrl}/api/users/profile`,
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: userData
            });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    function convertToCustomDateTime(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthName = months[date.getMonth()];
        return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
    }

    const totalSpent = orders.reduce((sum, order) =>
        sum + (order.order_details?.reduce((itemSum, item) =>
            itemSum + (item.base_price * item.quantity), 0) || 0), 0
    );

    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    console.log(orders)

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 py-8 px-4">
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
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <span className="text-3xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white ml-4 tracking-tight">FitEats Profile</h1>
                    </div>
                    <p className="text-purple-200 text-sm">Manage your account and track your orders</p>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Profile & Stats */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Profile Card */}
                        <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg ring-4 ring-white ring-opacity-20">
                                    {(userData?.name?.[0] || '?').toUpperCase()}
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3 text-center">{userData.name}</h2>

                                <div className='flex flex-col sm:flex-row gap-3 w-full'>
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                handleSave();
                                            } else {
                                                setIsEditing(true);
                                            }
                                        }}
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        {isEditing ? 'Save' : 'Edit'}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                                <div className="bg-transparent bg-opacity-5 rounded-xl p-3">
                                    <div className="flex items-center mb-2">
                                        <Mail className="h-4 w-4 text-orange-400 mr-2" />
                                        <span className="text-purple-200 text-xs font-medium">Email</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white text-sm"
                                        />
                                    ) : (
                                        <span className="text-white font-medium text-sm break-all">{userData.email}</span>
                                    )}
                                </div>

                                <div className="bg-transparent bg-opacity-5 rounded-xl p-3">
                                    <div className="flex items-center mb-2">
                                        <Phone className="h-4 w-4 text-orange-400 mr-2" />
                                        <span className="text-purple-200 text-xs font-medium">Phone</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={userData.phone_number}
                                            onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                            className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white text-sm"
                                        />
                                    ) : (
                                        <span className="text-white font-medium text-sm">{userData.phone_number}</span>
                                    )}
                                </div>

                                <div className="bg-transparent bg-opacity-5 rounded-xl p-3">
                                    <div className="flex items-center mb-2">
                                        <MapPin className="h-4 w-4 text-orange-400 mr-2" />
                                        <span className="text-purple-200 text-xs font-medium">Address</span>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            value={userData.address}
                                            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                            className="w-full bg-transparent bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white text-sm resize-none"
                                            rows="2"
                                        />
                                    ) : (
                                        <span className="text-white font-medium text-sm">{userData.address}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-5 text-center border border-white border-opacity-20 shadow-xl hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-2">
                                    <Package className="h-6 w-6 text-orange-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{orders.length}</div>
                                <div className="text-xs text-purple-200 font-medium">Total Orders</div>
                            </div>

                            <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-5 text-center border border-white border-opacity-20 shadow-xl hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-2">
                                    <Award className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{completedOrders}</div>
                                <div className="text-xs text-purple-200 font-medium">Completed</div>
                            </div>

                            <div className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-20 backdrop-blur-lg rounded-2xl p-5 text-center border border-green-400 border-opacity-30 shadow-xl">
                                <div className="flex justify-center mb-2">
                                    <TrendingUp className="h-6 w-6 text-green-300" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">₹{totalSpent.toFixed(2)}</div>
                                <div className="text-xs text-green-100 font-medium">Total Spent</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center">
                                    <Clock className="h-6 w-6 mr-3 text-orange-400" />
                                    Order History
                                </h3>
                                <span className="bg-transparent bg-opacity-10 px-4 py-2 rounded-full text-purple-200 text-sm font-medium">
                                    {orders.length} orders
                                </span>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <Package className="h-16 w-16 text-purple-300 mx-auto mb-4 opacity-50" />
                                    <p className="text-purple-200 text-lg font-medium">No orders yet</p>
                                    <p className="text-purple-300 text-sm mt-2">Start ordering to see your history here!</p>
                                </div>
                            ) : (
                                <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {orders.map((order, index) => (
                                        <Link to={`/order-details/${order.order_id}`}>

                                            <div key={index} className="bg-transparent cursor-pointer bg-opacity-5 backdrop-blur-sm rounded-2xl p-5 border border-white border-opacity-20 hover:bg-opacity-10 hover:scale-[1.02] transition-all duration-300 shadow-lg">
                                                <div className="flex items-start justify-between mb-4 pb-4 border-b border-white border-opacity-20">
                                                    <div className="flex-1">
                                                        <div className='flex flex-row gap-3 items-center mb-2 flex-wrap'>
                                                            <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-3 py-1.5 rounded-lg text-sm shadow-lg">
                                                                ORDER #{index + 1}
                                                            </div>
                                                            <div className="text-white font-semibold text-lg">{order.restaurant.restaurant_name}</div>
                                                        </div>
                                                        <div className="text-purple-200 text-xs flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1.5" />
                                                            {convertToCustomDateTime(order.order_time)}
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'delivered' ? 'bg-green-500 bg-opacity-20 text-green-300 ring-2 ring-green-400 ring-opacity-30' :
                                                        order.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300 ring-2 ring-yellow-400 ring-opacity-30' :
                                                            'bg-blue-500 bg-opacity-20 text-blue-300 ring-2 ring-blue-400 ring-opacity-30'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-4">
                                                    {order.order_details?.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex items-center justify-between bg-transparent bg-opacity-5 rounded-xl p-3 hover:bg-opacity-10 transition-all duration-200">
                                                            <div className="flex items-center flex-1">
                                                                <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold w-9 h-9 rounded-lg flex items-center justify-center text-sm mr-3 shadow-lg">
                                                                    {item.quantity}
                                                                </span>
                                                                <span className="text-white font-medium">Menu Item #{item.menu_id}</span>
                                                            </div>
                                                            <span className="text-orange-400 font-bold text-lg">
                                                                ₹{(item.base_price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20 bg-gradient-to-r from-green-500 from-opacity-10 to-emerald-500 to-opacity-10 rounded-xl p-4">
                                                    <span className="text-white font-bold text-lg flex items-center">
                                                        <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                                                        Total Amount
                                                    </span>
                                                    <span className="text-green-300 font-bold text-2xl">
                                                        ₹{order.order_details?.reduce((sum, item) => sum + (item.base_price * item.quantity), 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}