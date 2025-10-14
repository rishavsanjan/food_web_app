


import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MapPin, Clock, Phone, Package, CheckCircle, Bike, Navigation, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import config from '../config/config';
import { useUser } from '../contexts/userContext';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
};

const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const SRINAGAR_DEFAULT = { lat: 34.0837, lng: 74.7973 };
const STATUS_ORDER = ['assigned', 'picked_up', 'delivered'];

export default function OrderTracker() {
  const { id } = useParams();
  const { user } = useUser();
  const socketRef = useRef(null);

  const [orderDetails, setOrderDetails] = useState(null);
  const [orderStatus, setOrderStatus] = useState('assigned');
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(SRINAGAR_DEFAULT);
  const [routePath, setRoutePath] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDjyRoO4ogCeRr9IMw9LXYFL-y2HuxjZKg'
  });

  // Initialize socket connection once
  useEffect(() => {
    socketRef.current = io(config.apiUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Parse location helper
  const parseLocation = useCallback((lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) return null;
    return { lat: latitude, lng: longitude };
  }, []);

  // Fetch order details
  const getOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${config.apiUrl}/api/order/order-details/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderDetails: details, restaurant: restaurantData } = response.data;

      if (!details) {
        throw new Error('Order not found');
      }

      setOrderDetails(details);
      setRestaurant(restaurantData);

      // Set initial map center
      if (restaurantData?.lat && restaurantData?.long) {
        const location = parseLocation(restaurantData.lat, restaurantData.long);
        if (location) setMapCenter(location);
      }

      // Update order status
      const deliveryStatus = details?.deliveries?.delivery_status;
      if (deliveryStatus === 'delivered') {
        setOrderStatus('delivered');
      } else if (deliveryStatus === 'picked_up' || deliveryStatus === 'on_the_way') {
        setOrderStatus('picked_up');
      } else {
        setOrderStatus('assigned');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  }, [id, parseLocation]);

  // Initial order fetch
  useEffect(() => {
    getOrderDetails();
  }, [getOrderDetails]);

  // Join socket room
  useEffect(() => {
    const socket = socketRef.current;
    const userId = orderDetails?.user_id;

    if (socket && userId) {
      socket.emit('user:join', { userId });
      console.log(`User joined room: ${userId}`);
    }
  }, [orderDetails]);

  // Update route path based on status and locations
  const updateRoutePath = useCallback((driverLoc, restaurantLoc, deliveryLoc, status) => {
    if (!driverLoc) return;

    const path = [driverLoc];

    if (status === 'assigned' && restaurantLoc) {
      path.push(restaurantLoc);
    } else if ((status === 'picked_up' || status === 'delivered') && deliveryLoc) {
      path.push(deliveryLoc);
    }

    setRoutePath(path);
  }, []);

  // Listen for driver location updates
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleDriverLocationUpdate = ({ orderId, lat, long }) => {
      console.log('Driver location update:', { orderId, lat, long });

      // Filter by order ID
      if (orderId && orderId !== id) return;

      const newLocation = parseLocation(lat, long);
      if (!newLocation) {
        console.warn('Invalid driver location received');
        return;
      }

      setDriverLocation(newLocation);
      setMapCenter(newLocation);

      // Update route path
      const restaurantLoc = restaurant?.lat && restaurant?.long
        ? parseLocation(restaurant.lat, restaurant.long)
        : null;

      const deliveryLoc = user?.lat && user?.long
        ? parseLocation(user.lat, user.long)
        : null;

      updateRoutePath(newLocation, restaurantLoc, deliveryLoc, orderStatus);
    };

    const handleConnectionError = (error) => {
      console.error('Socket connection error:', error);
      setError('Real-time tracking temporarily unavailable');
    };

    socket.on('drivers:location:update', handleDriverLocationUpdate);
    socket.on('connect_error', handleConnectionError);
    socket.on('error', handleConnectionError);

    return () => {
      socket.off('drivers:location:update', handleDriverLocationUpdate);
      socket.off('connect_error', handleConnectionError);
      socket.off('error', handleConnectionError);
    };
  }, [id, restaurant, user, orderStatus, parseLocation, updateRoutePath]);

  // Status configuration
  const statusSteps = [
    { id: 'assigned', label: 'Preparing', icon: Package, color: 'text-orange-500' },
    { id: 'picked_up', label: 'On the Way', icon: Bike, color: 'text-pink-500' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-500' }
  ];

  const getStepStatus = useCallback((stepId) => {
    const currentIndex = STATUS_ORDER.indexOf(orderStatus);
    const stepIndex = STATUS_ORDER.indexOf(stepId);
    return stepIndex <= currentIndex ? 'completed' : 'pending';
  }, [orderStatus]);

  const getProgressWidth = useCallback(() => {
    const index = STATUS_ORDER.indexOf(orderStatus);
    return `${(index / (STATUS_ORDER.length - 1)) * 100}%`;
  }, [orderStatus]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading order details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">Error Loading Order</h2>
          <p className="text-purple-200 text-center">{error}</p>
          <button
            onClick={getOrderDetails}
            className="mt-6 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Order not found</div>
      </div>
    );
  }

  const restaurantLocation = restaurant?.lat && restaurant?.long
    ? parseLocation(restaurant.lat, restaurant.long)
    : null;

  const deliveryLocation = user?.lat && user?.long
    ? parseLocation(user.lat, user.long)
    : null;

  const subtotal = orderDetails?.order_details?.reduce(
    (total, item) => total + parseFloat(item.total_price || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Track Your Order</h1>
            <p className="text-purple-200 text-sm">Order #{orderDetails.order_id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Live Tracking</h2>
              <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4" />
                {orderDetails.estimatedTime || '15-20 min'}
              </div>
            </div>

            {/* Google Map */}
            <div className="h-80 rounded-2xl overflow-hidden mb-4 bg-gray-200">
              {isMapLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={14}
                  options={mapOptions}
                >
                  {restaurantLocation && (
                    <Marker
                      position={restaurantLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: '#f97316',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                        scale: 12,
                      }}
                      label={{ text: '🍽️', fontSize: '16px' }}
                    />
                  )}

                  {deliveryLocation && (
                    <Marker
                      position={deliveryLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: '#22c55e',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                        scale: 12,
                      }}
                      label={{ text: '🏠', fontSize: '16px' }}
                    />
                  )}

                  {driverLocation && (
                    <Marker
                      position={driverLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: '#ec4899',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                        scale: 10,
                      }}
                      label={{ text: '🏍️', fontSize: '18px' }}
                      animation={window.google.maps.Animation.BOUNCE}
                    />
                  )}

                  {routePath.length > 1 && (
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: '#ec4899',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                        geodesic: true
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                  <p className="text-gray-600">Loading map...</p>
                </div>
              )}
            </div>

            {/* Live Status Indicator */}
            {driverLocation && orderStatus !== 'delivered' && (
              <div className="mb-4 bg-pink-500/20 border border-pink-400 rounded-lg p-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pink-300 animate-pulse" />
                <span className="text-white text-sm font-medium">
                  Driver is on the move - Live tracking active
                </span>
              </div>
            )}

            {/* Status Timeline */}
            <div className="flex justify-between items-center relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-white/20"></div>
              <div
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-green-500 transition-all duration-500"
                style={{ width: getProgressWidth() }}
              ></div>

              {statusSteps.map((step) => {
                const Icon = step.icon;
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${status === 'completed'
                        ? 'bg-gradient-to-br from-orange-400 to-pink-500 border-white'
                        : 'bg-white/20 border-white/40'
                      }`}>
                      <Icon className={`w-5 h-5 ${status === 'completed' ? 'text-white' : 'text-white/60'}`} />
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${status === 'completed' ? 'text-white' : 'text-white/60'
                      }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Section */}
          <div className="space-y-6">
            {/* Rider Info */}
            {orderDetails?.deliveries?.delivery_agent && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Your Delivery Rider</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {orderDetails.deliveries.delivery_agent.agent_name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {orderDetails.deliveries.delivery_agent.agent_name}
                      </p>
                      <p className="text-purple-200 text-sm">
                        {orderDetails.deliveries.delivery_agent.agent_phone}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${orderDetails.deliveries.delivery_agent.agent_phone}`}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    aria-label="Call delivery agent"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Order Details</h3>
              <div className="space-y-3 mb-4">
                {orderDetails?.order_details?.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-300">{item.quantity}x</span>
                      <span>{item?.menu?.menu_name}</span>
                    </div>
                    <span className="font-semibold">₹{parseFloat(item?.total_price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex justify-between text-purple-200">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Delivery Fee</span>
                  <span>₹{parseFloat(orderDetails?.delivery_fee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/20">
                  <span>Total</span>
                  <span>₹{parseFloat(orderDetails?.total_amount || subtotal).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Delivery Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  {orderDetails?.deliveries?.delivery_address || 'Address not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}