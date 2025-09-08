import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, Heart, Clock, Star } from 'lucide-react';
import axios from 'axios';

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: ''
    });

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

    useEffect(() => {
        getProfile();
    }, [])

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const recentOrders = [
        { restaurant: 'Burger Palace', date: '2 days ago', status: 'Delivered' },
        { restaurant: 'Sushi Zen', date: '1 week ago', status: 'Delivered' },
        { restaurant: 'Pizza Corner', date: '2 weeks ago', status: 'Delivered' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 py-8 px-4">
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

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">{userData.name}</h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
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
                <div className="grid grid-cols-3 gap-4">
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
                </div>

                {/* Recent Orders */}
                <div className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Orders
                    </h3>

                    <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-white border-opacity-10 last:border-b-0">
                                <div>
                                    <div className="text-white font-medium">{order.restaurant}</div>
                                    <div className="text-purple-300 text-sm">{order.date}</div>
                                </div>
                                <div className="text-green-400 text-sm font-medium">{order.status}</div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 text-orange-400 hover:text-orange-300 font-medium text-center transition-colors duration-200">
                        View All Orders
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 text-white font-medium hover:bg-opacity-15 transition-all duration-300 flex items-center justify-center">
                        <Heart className="h-5 w-5 mr-2" />
                        My Favorites
                    </button>

                    <button className="bg-transparent bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 text-white font-medium hover:bg-opacity-15 transition-all duration-300 flex items-center justify-center">
                        <User className="h-5 w-5 mr-2" />
                        Account Settings
                    </button>
                </div>
            </div>
        </div>
    );
}