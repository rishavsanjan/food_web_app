import React, { useState, useEffect } from 'react';

const CartClearModal = ({ setCartClearModel , addToCart, setCart}) => {


    return (
        <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 z-50 transition-opacity duration-300 `}
        >
            <div
                className={`bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/20 transform transition-all duration-400 `}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90 flex items-center justify-center"
                >
                    ×
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                        Replace Cart Items?
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed">
                        Adding items from a different restaurant will clear your current cart
                    </p>
                </div>


                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => { setCartClearModel(false) }}
                        className="flex-1 py-4 px-6 bg-white/10 text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Keep Current Cart
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('cart');
                            localStorage.removeItem('cart_restaurant');
                            setCartClearModel(false);
                            setCart([]);
                        }}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Clear & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CartClearModal;