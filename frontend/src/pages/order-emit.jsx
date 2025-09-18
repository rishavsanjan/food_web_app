import React, { useState, useEffect, useMemo } from 'react';
import { Package, MapPin, Clock, Navigation, AlertCircle, X, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { io } from 'socket.io-client';
import config from '../config/config';


const OrderNotificationOverlay = ({ driver, orderDetails, order, user, restaurant, onClose }) => {
    const [showOrderNotification, setShowOrderNotification] = useState(true);
    const [acceptTimer, setAcceptTimer] = useState(15);
    const socket = useMemo(() => io(`${config.apiUrl}`), []);

    // Sample order data
    const pendingOrder = {
        id: '#FE2026',
        restaurant: 'Spicy Dragon',
        customer: 'Emma Davis',
        address: '567 Main St, Downtown',
        items: 3,
        value: '24.50',
        tip: '3.50',
        distance: '2.3 km',
        estimatedTime: '15 min',
        priority: 'urgent'
    };

    // Countdown timer effect
    useEffect(() => {
        if (showOrderNotification && acceptTimer > 0) {
            const timer = setTimeout(() => {
                setAcceptTimer(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (acceptTimer === 0) {
            setShowOrderNotification(false);
            setAcceptTimer(15);
        }
    }, [acceptTimer, showOrderNotification]);

    const acceptOrder = async () => {
        console.log('Order accepted:', pendingOrder.id);
        setShowOrderNotification(false);
        setAcceptTimer(15);
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/agent/assignorder`,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                order_id: orderDetails[0].order_id,
                delivery_address: user.address,
                restaurant_address: restaurant.restaurant_address
            }
        });
        console.log(response.data)
        if (response.status === 200) {
            socket.emit('order_accepted', { driverAssignedId: driver.user_id });
        }
        setTimeout(() => {
            onClose();

        }, 1500);
        toast.success('Order is accepted!');
    };

    const declineOrder = () => {
        console.log('Order declined:', pendingOrder.id);
        setShowOrderNotification(false);
        setAcceptTimer(15);
        setTimeout(() => {
            onClose();

        }, 1500);
        toast.warn('Order is rejected!');

    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Order Notification Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4 animate-pulse">
                    {/* Header with timer */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-500/20 p-3 rounded-xl">
                                <Package className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">New Order!</h3>
                                <p className="text-purple-200 text-sm">Accept within {acceptTimer}s</p>
                            </div>
                        </div>
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="4"
                                    fill="transparent"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="#f97316"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 20}`}
                                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - acceptTimer / 15)}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-orange-400 font-bold text-sm">{acceptTimer}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex flex-col items-center space-x-2">
                                    <p className="text-purple-200">{restaurant.restaurant_name}</p>
                                    <p className="text-purple-200">{restaurant.restaurant_address}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-400">₹{(parseFloat(order.totalPrice))}</p>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <p className="text-white font-medium">{user.name}</p>
                            </div>
                            <p className="text-purple-200 text-sm">{user.address}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {/* <div className="bg-black/20 rounded-lg p-3 text-center">
                                <Package className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                                <p className="text-white font-medium text-sm">{pendingOrder.items}</p>
                                <p className="text-purple-200 text-xs">Items</p>
                            </div> */}
                            {/* <div className="bg-black/20 rounded-lg p-3 text-center">
                                <Navigation className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                                <p className="text-white font-medium text-sm">{pendingOrder.distance}</p>
                                <p className="text-purple-200 text-xs">Distance</p>
                            </div> */}
                            {/* <div className="bg-black/20 rounded-lg p-3 text-center">
                                <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                                <p className="text-white font-medium text-sm">{pendingOrder.estimatedTime}</p>
                                <p className="text-purple-200 text-xs">ETA</p>
                            </div> */}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={declineOrder}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                        >
                            <X className="w-5 h-5" />
                            <span>Decline</span>
                        </button>
                        <button
                            onClick={acceptOrder}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg"
                        >
                            <Check className="w-5 h-5" />
                            <span>Accept</span>
                        </button>
                    </div>

                    {/* Sound notification indicator */}
                    <div className="flex items-center justify-center mt-4">
                        <div className="flex space-x-1">
                            <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-6 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderNotificationOverlay;