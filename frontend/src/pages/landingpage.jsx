import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Star, Clock, Shield, Smartphone, MapPin, Heart, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
import axios from 'axios';
import OurInfo from './usernotlogged';
import Lottie from "lottie-react";
import loadingAnimation from '../../assets/loading-animation/pac_buffer.json';
import config from '../config/config';
import Header from './header';
import { io } from 'socket.io-client';

export default function FoodDeliveryLanding() {
    const socket = useMemo(() => io(`${config.apiUrl}`), []);

    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [restaurantss, setRestaurants] = useState();
    const [restaurantLoading, setRestaurantLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchResultModal, setSearchResultModal] = useState(false);
    const [userLocation, setUserLocation] = useState({
        lat: 23,
        long: 78
    })

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/users/profile`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        console.log(response.data);

        console.log(response.data.user);
        setUser(response.data.user);
        //getRestraunts();
        if (response) {
            setIsLogin(true);
        }
    }

    useEffect(() => {
        if (user.role === 'CUSTOMER') {
            socket.emit("user:join", { userId: user.user_id });
        }
    }, [user])


    const fetchRestaurants = async (lat, long) => {
        console.log(lat, long)
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/users/nearby/${lat}/${long}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },

        })
        setRestaurants(response.data.restaurants)
        setRestaurantLoading(false)
        console.log(response.data)
    }

    console.log(restaurantss)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log("User location:", lat, long);
                    setUserLocation({ lat, long });
                    fetchRestaurants(lat, long);
                },
                (err) => console.error("Geolocation error:", err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation not supported by your browser");
        }
    }, []);

    // const getRestraunts = async () => {
    //     const token = localStorage.getItem('token');
    //     const response = await axios({
    //         url: `${config.apiUrl}/api/users/getRest`,
    //         method: 'GET',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         }
    //     })
    //     setRestaurants(response.data.data);
    //     setRestaurantLoading(false);
    //     console.log(response.data.data);
    // };

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim()) {
                const response = await axios({
                    url: `${config.apiUrl}/api/rest/search`,
                    method: 'get',
                    params: {
                        search: searchQuery
                    }
                })
                console.log(response.data)
                setSearchResult(response.data.restaurants);
            } else {
                setSearchResult([]);
            }
        }, 500);

        return () => {
            clearTimeout(delayDebounce);
        }

    }, [searchQuery])

    useEffect(() => {
        getProfile();
    }, [])



    // Handle click outside to close search modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchContainer = document.getElementById('search-container');
            if (searchContainer && !searchContainer.contains(event.target)) {
                setSearchResultModal(false);
            }
        };

        if (searchResultModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchResultModal]);

    const features = [
        { icon: <Clock className="w-8 h-8" />, title: "Lightning Fast", desc: "Average delivery in 30 minutes" },
        { icon: <Shield className="w-8 h-8" />, title: "Safe & Secure", desc: "Contactless delivery guaranteed" },
        { icon: <Star className="w-8 h-8" />, title: "Top Rated", desc: "4.9/5 from 50k+ happy customers" },
        { icon: <MapPin className="w-8 h-8" />, title: "Wide Coverage", desc: "Available in 100+ cities" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
            {/* Navigation */}
            <Header />

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 text-6xl animate-bounce">🍕</div>
                <div className="absolute top-40 right-20 text-5xl animate-pulse">🍔</div>
                <div className="absolute bottom-40 left-20 text-4xl animate-bounce delay-1000">🍜</div>
                <div className="absolute bottom-20 right-10 text-5xl animate-pulse delay-500">🌮</div>

                <div className="relative z-10 text-center max-w-4xl mx-auto sm:py-0 py-32">
                    <h1 className="text-6xl md:text-8xl font-bold  bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse pb-4">
                        Craving Something?
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed ">
                        Get your healthy meals delivered +hot and fresh in 30 minutes or less. From local gems to popular chains.
                    </p>
                    <div className="relative w-full max-w-4xl mx-auto" id="search-container">
                        {/* Search Section */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <div className="relative">
                                <input
                                    onFocus={() => setSearchResultModal(true)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery}
                                    type="text"
                                    placeholder="Search any restaurant..."
                                    className="w-80 px-6 py-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <MapPin className="absolute right-4 top-4 w-6 h-6 text-orange-400" />
                            </div>
                            <button
                                onClick={() => setSearchResultModal(!searchResultModal)}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                Find Restaurants <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Results Modal */}
                        {searchResultModal && searchQuery.trim() && searchResult.length > 0 && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 ">
                                <div className="bg-purple-400/75 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 bg-purple-400/75 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            Search Results ({searchResult.length})
                                        </h3>
                                    </div>

                                    {/* Results List */}
                                    <div className="max-h-64 overflow-y-auto">
                                        {searchResult.map((rest) => (
                                            <Link
                                                key={rest.id_restaurant}
                                                to={`/restraunt/${rest.id_restaurant}`}
                                                onClick={() => {
                                                    setSearchResultModal(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <div className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
                                                    <img
                                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                        src={rest.image}
                                                        alt={rest.restaurant_name}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {rest.restaurant_name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {rest.restaurant_address}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 py-3 bg-purple-400/75 border-t border-gray-200">
                                        <button
                                            onClick={() => setSearchResultModal(false)}
                                            className="text-xs text-white hover:text-gray-800 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Results Message */}
                        {searchResultModal && searchQuery.trim() && searchResult.length === 0 && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
                                <div className="bg-purple-400/75 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-sm text-gray-800">No restaurants found for "{searchQuery}"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-8 text-center">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                            <div className="text-3xl font-bold text-orange-400">1000+</div>
                            <div className="text-sm text-gray-300">Restaurants</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                            <div className="text-3xl font-bold text-pink-400">50k+</div>
                            <div className="text-sm text-gray-300">Happy Users</div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-white/60" />
                </div>
            </section>



            {/* Featured Restaurants */}
            <section id="restaurants" className={`${isLogin && 'py-20 px-4 bg-black/20'} `}>
                {
                    restaurantLoading && isLogin && user.role === 'CUSTOMER' ?
                        <>
                            <div className="flex items-center justify-center backdrop-blur-md bg-transparent flex-col ">
                                <Lottie
                                    animationData={loadingAnimation}
                                    loop={true}
                                    style={{ width: 200, height: 200 }}
                                />
                                <h1 className='text-xl font-semibold'>Loading Restaurants...</h1>
                            </div>
                        </>
                        :
                        <>
                            {
                                isLogin && user.role === 'CUSTOMER' &&
                                <>
                                    <div className="max-w-7xl mx-auto">
                                        <div className="text-center mb-16">
                                            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                                Popular Near You
                                            </h2>
                                            <p className="text-xl text-gray-300">Discover amazing restaurants in your neighborhood</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {restaurantss?.map((restaurant, index) => (
                                                <div key={index} className="group bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                                                    <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                                                        <img src={`${restaurant?.image || 'https://cdn.pixabay.com/photo/2015/02/23/21/10/restaurant-646687_1280.jpg'}`} alt="" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold mb-2">{restaurant?.restaurant_name || 'N/A'}</h3>
                                                    <p className="text-gray-400 mb-4">30-35 mins</p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                                            <span className="text-lg font-semibold">{restaurant?.rating || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/restraunt/${restaurant.id_restaurant}`}>
                                                        <button
                                                            className="hidden sm:flex cursor-pointer justify-center w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-full  font-semibold hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                                        >
                                                            Order Now
                                                        </button>
                                                        <button className="sm:hidden flex justify-center w-full  mt-4 bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-full font-semibold  transition-all ">
                                                            Order Now
                                                        </button>
                                                    </Link>
                                                </div>
                                            )) || 'N/A'}
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                }
            </section>

            {/* Features Section */}
            <OurInfo />

            {/* Footer */}
            <footer className="bg-black/40 backdrop-blur-lg py-12 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                                    <span className="text-xl font-bold">🍽️</span>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">FitEats</span>
                            </div>
                            <p className="text-gray-400">Delivering happiness, one meal at a time.</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>About Us</div>
                                <div>Careers</div>
                                <div>Press</div>
                                <div>Blog</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>Help Center</div>
                                <div>Safety</div>
                                <div>Contact Us</div>
                                <div>Terms of Service</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Connect</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>Instagram</div>
                                <div>Facebook</div>
                                <div>Twitter</div>
                                <div>LinkedIn</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Work with us</h4>
                            <div className="space-y-2 text-gray-400">
                                <Link to={'/restaurant-signup'}>
                                    <div>Add your restaurant</div>
                                </Link>
                                <Link to={'/delivery-signup'}>
                                    <div>Works as a delivery partner</div>
                                </Link>


                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 FitEats. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-500" /> for food lovers.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}