import React, { useEffect, useState } from 'react'
import { Star, Clock, MapPin, Phone, Heart, ChefHat, Utensils, Wine, Coffee, Menu, X, ArrowRight, Award, Activity, Zap, Feather, Shield, Leaf, } from 'lucide-react';
import config from '../config/config';
import { useCart } from '../contexts/cartContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/userContext';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems } = useCart();
    const { user } = useUser();
    const isLogin = !!user;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-purple-500/20 backdrop-blur-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                            <span className="text-xl font-bold">🍽️</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">FitEats</span>
                    </div>

                    <div className="hidden md:flex  space-x-8 items-center ">
                        <a href="#home" className="hover:text-orange-400 transition-colors">Home</a>
                        <a href="#restaurants" className="hover:text-orange-400 transition-colors">Restaurants</a>
                        {
                            !isLogin ?
                                <Link to={'/login'}>
                                    <h1 className="hover:text-orange-400 transition-colors">Login / Sign Up</h1>
                                </Link>
                                :
                                <Link to={`${user.role === 'RESTAURANT_OWNER' ? '/restaurant-admin' : `${user.role === 'CUSTOMER' ? '/profile' : '/delivery-pofile'}`} `}>
                                    <h1 className="hover:text-orange-400 transition-colors"> {user.name}</h1>
                                </Link>

                        }

                        {
                            isLogin &&
                            <Link className='flex items-center justify-center ' to={'/cart'}>
                                <button className='items-center px-8 mt-4 bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-full'>
                                    Cart ({cartItems.length})
                                </button>
                            </Link>
                        }

                    </div>


                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-purple-500/40 backdrop-blur-md">
                    <div className="px-4 py-6 space-y-4">
                        <a href="#home" className="block hover:text-orange-400 transition-colors">Home</a>
                        <a href="#restaurants" className="block hover:text-orange-400 transition-colors">Restaurants</a>
                        <a href="#features" className="block hover:text-orange-400 transition-colors">Features</a>
                        {
                            isLogin &&
                            <Link className='flex items-center justify-center mb-4' to={'/cart'}>
                                <button className='items-center px-8 mt-4 bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-full'>
                                    Cart ({cartItems.length})
                                </button>
                            </Link>
                        }
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Header