import { useEffect, useMemo, useState } from 'react';
import { ChefHat, Plus, Minus, Trash2, ArrowLeft, Clock, MapPin, CreditCard, ShoppingBag, Star, Heart, Gift, Percent, Activity, Zap, Leaf, Shield, BottleWine, Vegan, VeganIcon, LucideVegan, LeafyGreen, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { io } from 'socket.io-client';
import OrderSuccess from './order_confirm_model';
import config from '../config/config';

import "../assets/loader/loader.css"


export default function Cart() {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const navigate = useNavigate();
  const socket = useMemo(() => io(`${config.apiUrl}`), []);
  const [user, setUser] = useState([]);
  const [orderSuccessModel, setOrderSuccessModel] = useState(false);


  const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `${config.apiUrl}/api/users/profile`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })

    setUser(response.data.user)
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
    if (localStorage.getItem('cart_restaurant')) {
      setRestaurant(JSON.parse(localStorage.getItem("cart_restaurant")));
      console.log(JSON.parse(localStorage.getItem("cart_restaurant")))
    }
    setCart(JSON.parse(localStorage.getItem("cart") || []));
  }, []);
  console.log(cart)


  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [laoding, setLoading] = useState(false);

  const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', description: 'Welcome offer - 10% off' },
    'SAVE500': { discount: 500, type: 'fixed', description: 'Save ₹500 on orders above ₹2000' },
    'CHEF20': { discount: 20, type: 'percentage', description: "Chef's special - 20% off" }
  };



  const applyPromoCode = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()]
      });
      setPromoCode('');
      toast.success(`Promo code applied successfully! ${promoCode.toUpperCase()}`)
    } else {
      toast.error(`Invaid Code!`)
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success(`Promo code removed successfully!`)
  };

  const calculateSubtotal = () => {
    return cart?.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const CalculateCalories = () => {
    const totalCalories = cart?.reduce((total, item) => total + (item.calories * item.quantity), 0);
    return totalCalories;
  }
  const CalculateCarbohydrates = () => {
    const totalCalories = cart?.reduce((total, item) => total + parseInt(item.carbohydrates * item.quantity), 0);
    return totalCalories;
  }
  const CalculateFat = () => {
    const totalCalories = cart?.reduce((total, item) => total + parseInt(item.fat * item.quantity), 0);
    return totalCalories;
  }
  const CalculateFiber = () => {
    const totalCalories = cart?.reduce((total, item) => total + parseInt(item.fiber * item.quantity), 0);
    return totalCalories;
  }
  const CalculateCholesterol = () => {
    const totalCalories = cart?.reduce((total, item) => total + parseInt(item.cholesterol * item.quantity), 0);
    return totalCalories;
  }
  const CalculateProtien = () => {
    const totalCalories = cart?.reduce((total, item) => total + parseInt(item.protein * item.quantity), 0);
    return totalCalories;
  }






  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {

      return Math.floor(subtotal * (appliedPromo.discount / 100));
    } else {
      return Math.min(appliedPromo.discount, subtotal);
    }
  };

  const calculateDeliveryFee = () => {
    if (deliveryType === 'pickup') return 0;
    const subtotal = calculateSubtotal();
    return subtotal >= 2000 ? 0 : 150; // Free delivery above ₹2000
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal() - calculateDiscount();
    return Math.floor(subtotal * 0.18); // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateDeliveryFee() + calculateTax();
  };

  const removeQuantity = (updateItem) => {
    setCart(prev => {
      const existingDishIndex = prev.findIndex(item => item.menu_id === updateItem.menu_id);
      const updatedCart = prev.map((dish) => {
        if (dish.menu_id === updateItem.menu_id) {
          return {
            ...dish,
            quantity: dish.quantity - 1
          }
        }
        return dish;
      })
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    })
    toast.success('Dish removed successfully!')

  }
  
  const addQuantity = (updateItem) => {
    setCart(prev => {
      const existingDishIndex = prev.findIndex(item => item.menu_id === updateItem.menu_id);
      const updatedCart = prev.map((dish) => {
        if (dish.menu_id === updateItem.menu_id) {
          return {
            ...dish,
            quantity: dish.quantity + 1
          }
        }
        return dish;
      })
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    })
    toast.success('Dish added successfully!')

  }

  const removeItem = (id) => {
    setCart(prev => {
      const updatedCart = prev.filter(item => item.menu_id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    })
    toast.success('Dish deleted successfully!')
  }

  const placeOrder = async () => {
    setLoading(true)
    const items = cart.map((dish) => {
      return {
        menu_id: dish.menu_id,
        quantity: dish.quantity
      }
    })
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `${config.apiUrl}/api/order/create`,
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        id_restaurant: restaurant.id_restaurant,
        items: items,
        instructions: specialInstructions,
        payment_method: 'UPI'
      }
    });
    console.log(response.data)
    localStorage.removeItem('cart');



    setOrderSuccessModel(true);

    socket.emit('emit_order_to_riders', {
      orderDetails: response.data.orderDetails,
      user: user,
      restaurant: restaurant,
      order: {
        items: items,
        totalPrice: calculateTotal()
      }
    })
    setLoading(false);
    navigate('/order-confirm', { state: { cart } });
  }

  console.log(orderSuccessModel)


  if (cart?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => { navigate('/') }} className="p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  FitEats
                </h1>
                
              </div>
            </div>
          </div>

          {/* Empty Cart */}
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-400/20 to-pink-500/20 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Looks like you haven't added any delicious dishes to your cart yet. Explore our menu and discover amazing flavors!
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
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
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-3xl animate-float opacity-20">🍽️</div>
      <div className="absolute top-40 right-20 text-2xl animate-float delay-1000 opacity-20">🍷</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-float delay-500 opacity-20">🥘</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => { navigate(-1) }} className="p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  FitEats
                </h1>
                <p className="text-sm text-gray-400">Your Cart</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">{cart?.length} Items</p>
            <p className="text-sm text-gray-400">₹{calculateTotal().toLocaleString()}</p>
          </div>
        </div>
        {/* Restaurant Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <h4 className="font-bold">{restaurant?.restaurant_name}</h4>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-400 ml-1">{restaurant?.rating}</span>
          </div>
          <p className="text-xs text-gray-400">
            {restaurant?.restaurant_address}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">


            {/* Cart Items List */}
            <div className="space-y-4">
              {cart?.map((item) => (
                <div key={item.menu_id} className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{item.menu_name} {item.category === 'veg' ? '🥦' : '🍗'}</h3>
                            {item.chef && (
                              <div className="bg-orange-500 p-1 rounded-full" title="Chef's Special">
                                <ChefHat className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
                        </div>

                        <button
                          onClick={() => removeItem(item.menu_id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Health Information Section - Prominently Displayed */}
                      <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-400/20">
                        <div className="flex items-center gap-1 mb-2">
                          <Activity className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Nutritional Info</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          {/* Calories - Most Prominent */}
                          <div className="col-span-2 sm:col-span-1 bg-orange-500/15 rounded-xl p-2 border border-orange-400/30">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-400">{item.calories * item.quantity}</div>
                              <div className="text-xs text-orange-300">Calories</div>
                            </div>
                          </div>

                          {/* Protein - Highlighted */}
                          <div className="bg-blue-500/15 rounded-xl p-2 border border-blue-400/30">
                            <div className="text-center">
                              <div className="text-sm font-bold text-blue-400">{item.protein * item.quantity}g</div>
                              <div className="text-xs text-blue-300">Protein</div>
                            </div>
                          </div>

                          {/* Carbs */}
                          <div className="bg-yellow-500/15 rounded-xl p-2 border border-yellow-400/30">
                            <div className="text-center">
                              <div className="text-sm font-bold text-yellow-400">{item.carbohydrates * item.quantity}g</div>
                              <div className="text-xs text-yellow-300">Carbs</div>
                            </div>
                          </div>

                          {/* Fat */}
                          <div className="bg-purple-500/15 rounded-xl p-2 border border-purple-400/30">
                            <div className="text-center">
                              <div className="text-sm font-bold text-purple-400">{item.fat * item.quantity}g</div>
                              <div className="text-xs text-purple-300">Fat</div>
                            </div>
                          </div>

                          {/* Fiber */}
                          <div className="bg-green-500/15 rounded-xl p-2 border border-green-400/30">
                            <div className="text-center">
                              <div className="text-sm font-bold text-green-400">{(item.fiber * item.quantity).toFixed(2)}g</div>
                              <div className="text-xs text-green-300">Fiber</div>
                            </div>
                          </div>

                          {/* Cholesterol */}
                          <div className="bg-red-500/15 rounded-xl p-2 border border-red-400/30">
                            <div className="text-center">
                              <div className="text-sm font-bold text-red-400">{item.cholesterol * item.quantity}mg</div>
                              <div className="text-xs text-red-300">Cholesterol</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Health Indicators Bar */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        {/* High Protein Indicator */}
                        {parseInt(item.protein) >= 20 && (
                          <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-400/30">
                            <Zap className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-400 font-medium">High Protein</span>
                          </div>
                        )}

                        {/* High Fiber Indicator */}
                        {parseFloat(item.fiber) >= 3 && (
                          <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30">
                            <Leaf className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">High Fiber</span>
                          </div>
                        )}

                        {/* Low Calorie Indicator */}
                        {parseInt(item.calories) <= 300 && (
                          <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-400/30">
                            <Heart className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">Light Option</span>
                          </div>
                        )}

                        {/* Low Fat Indicator */}
                        {parseInt(item.fat) <= 10 && (
                          <div className="flex items-center gap-1 bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-400/30">
                            <Shield className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400 font-medium">Low Fat</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            disabled={item.quantity === 1}
                            onClick={() => removeQuantity(item)}
                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => addQuantity(item)}
                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-400">
                            ₹{(item.price).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          )}
                          {/* Total calories for quantity */}
                          <p className="text-xs text-green-400">
                            {(parseInt(item.calories) * item.quantity).toLocaleString()} cal total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                Special Instructions
              </h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for your order? (e.g., extra spicy, no onions, etc.)"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Delivery Type Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border flex items-center flex-col border-white/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                Delivery
              </h2>
              <div className="flex gap-4">
                <div className="text-center items-center flex flex-col justify-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="font-semibold">Delivery</p>
                  <p className="text-sm text-gray-400">45-60 mins</p>
                </div>
              </div>
            </div>
            {/* Promo Code */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-green-400" />
                Promo Code
              </h3>

              {appliedPromo ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-400">{appliedPromo.code}</p>
                    <p className="text-xs text-green-300">{appliedPromo.description}</p>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-400">
                <p>Available codes: WELCOME10, SAVE500, CHEF20</p>
              </div>
            </div>


            {/*  Nutritional Value */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 flex flex-col gap-2 items-center">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BottleWine className="w-5 h-5 text-green-400" />
                Total Nutritional Value
              </h3>
              <p>Calories : {<CalculateCalories />} g</p>
              <p>Carbohydrates : {<CalculateCarbohydrates />} g</p>
              <p>Fat : {<CalculateFat />} g</p>
              <p>Fiber : {<CalculateFiber />} g</p>
              <p>Protien : {<CalculateProtien />} g</p>
              <p>Cholesterol : {<CalculateCholesterol />} g</p>
            </div>



            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cart?.length} items)</span>
                  <span>₹{calculateSubtotal()?.toLocaleString()}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{calculateDiscount().toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    {calculateDeliveryFee() === 0 && <span className="text-xs text-green-400">(Free)</span>}
                  </span>
                  <span>₹{calculateDeliveryFee()}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{calculateTax().toLocaleString()}</span>
                </div>

                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-orange-400">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {deliveryType === 'delivery' ? 'Delivery in 45-60 mins' : 'Ready for pickup in 20-30 mins'}
                  </span>
                </div>

                <button onClick={() => { placeOrder() }} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">

                  {laoding ?
                    <div className='flex flex-row items-center justify-center gap-2'>
                      <p>Placing order</p>
                      <div className='loader'></div>
                    </div>

                    : 'Proceed to Checkout'}
                </button>

                <button  className="w-full border-2 border-white/30 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}