import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, Heart, Clock, Star, LogOutIcon } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


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
            url: 'http://localhost:3000/api/users/profile',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setUserData(response.data.user);
        console.log(response.data.user)
    }

    const getOrder = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: 'http://localhost:3000/api/order/list',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setOrders(response.data.orders);
        console.log(response.data)
    }

    useEffect(() => {
        getProfile();
        getOrder();
    }, [])

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

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
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white ml-3">QuickBite Profile</h1>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                    <div className="flex flex-col items-center mb-6">
                        {/* Profile Picture */}
                        <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                            SJ
                        </div>

                        <div className="text-center ">
                            <h2 className="text-2xl font-bold text-white mb-2">{userData.name}</h2>
                            <div className='flex flex-row gap-2'>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                    }
                                    }
                                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center"
                                >
                                    <LogOutIcon className="h-4 w-4 mr-2" />
                                    LogOut
                                </button>

                            </div>

                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 text-orange-400 mr-4 flex-shrink-0" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white flex-1 placeholder-purple-200"
                                />
                            ) : (
                                <span className="text-purple-200">{userData.email}</span>
                            )}
                        </div>

                        <div className="flex items-center">
                            <Phone className="h-5 w-5 text-orange-400 mr-4 flex-shrink-0" />
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={userData.phone_number}
                                    onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                    className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white flex-1 placeholder-purple-200"
                                />
                            ) : (
                                <span className="text-purple-200">{userData.phone_number}</span>
                            )}
                        </div>

                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-orange-400 mr-4 flex-shrink-0" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.address}
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                    className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white flex-1 placeholder-purple-200"
                                />
                            ) : (
                                <span className="text-purple-200">{userData.address}</span>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300"
                            >
                                Save Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-3 gap-4">
                    <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white border-opacity-20">
                        <div className="text-2xl font-bold text-white mb-1">42</div>
                        <div className="text-sm text-purple-200">Orders</div>
                    </div>

                    <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white border-opacity-20">
                        <div className="text-2xl font-bold text-white mb-1">12</div>
                        <div className="text-sm text-purple-200">Favorites</div>
                    </div>

                    <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white border-opacity-20">
                        <div className="flex items-center justify-center text-2xl font-bold text-white mb-1">
                            4.8 <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                        </div>
                        <div className="text-sm text-purple-200">Rating</div>
                    </div>
                </div> */}

                {/* Recent Orders */}
                <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Orders
                    </h3>

                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div key={index} className="border-b border-white border-opacity-10 last:border-b-0 pb-4 last:pb-0">
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className='flex flex-row gap-2'>
                                            <div className="text-white font-medium"># {index+1}</div>
                                            <div className="text-white font-medium">{order.restaurant.restaurant_name}</div>
                                        </div>

                                        <div className="text-purple-300 text-sm">{convertToCustomDateTime(order.order_time)}</div>
                                    </div>
                                    <div className="text-green-400 text-sm font-medium">{order.status}</div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-3">
                                    {order.order_details?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <span className="text-white opacity-80 mr-2">
                                                    {item.quantity}x
                                                </span>
                                                <span className="text-white">Menu Item #{item.menu_id}</span>
                                            </div>
                                            <span className="text-orange-400 font-medium">
                                                ₹{(item.base_price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="flex items-center justify-between pt-2 border-t border-white border-opacity-10">
                                    <span className="text-white font-medium">Total</span>
                                    <span className="text-green-400 font-bold">
                                        ₹{order.order_details?.reduce((sum, item) => sum + (item.base_price * item.quantity), 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 text-orange-400 hover:text-orange-300 font-medium text-center transition-colors duration-200">
                        View All Orders
                    </button>

                </div>

                {/* Action Buttons */}
                {/* <div className="grid grid-cols-2 gap-4">
                    <button className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 text-white font-medium hover:bg-opacity-15 transition-all duration-300 flex items-center justify-center">
                        <Heart className="h-5 w-5 mr-2" />
                        My Favorites
                    </button>

                    <button className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 text-white font-medium hover:bg-opacity-15 transition-all duration-300 flex items-center justify-center">
                        <User className="h-5 w-5 mr-2" />
                        Account Settings
                    </button>
                </div> */}
            </div>
        </div >
    );
}