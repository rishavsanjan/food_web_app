import { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Phone, Heart, ChefHat, Utensils, Wine, Coffee, Menu, X, ArrowRight, Award, Activity, Zap, Feather, Shield, Leaf, } from 'lucide-react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CartClearModel from '../models/replaceRestaurantInCart'
import Lottie from "lottie-react";
import loadingAnimation from '../../assets/loading-animation/pac_buffer.json'
import { ToastContainer, toast } from 'react-toastify';


export default function RestaurantLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [scrollY, setScrollY] = useState(0);
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const { id } = useParams();
  const [vegMenu, setVegMenu] = useState([]);
  const [nonVegMenu, setNonVegMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartClearModel, setCartClearModel] = useState(false);
  const [loading, setLoading] = useState(true);




  const getMenu = async () => {
    const token = localStorage.getItem('token');
    const response = await axios({
      url: `http://localhost:3000/api/users/rest/menus/${id}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    setMenu(response.data.menus);
    setRestaurant(response.data.restaurant);
    setVegMenu(response.data.vegMenus);
    setNonVegMenu(response.data.nonVegMenus);
    console.log(response.data);
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
    setCart(JSON.parse(localStorage.getItem("cart") || []));
    setLoading(false);

  }

  useEffect(() => {
    getMenu();
  }, []);




  const addToCart = async (newItem) => {
    if (cart?.length === 0) {
      localStorage.setItem('cart_restaurant', "{}");
      localStorage.setItem('cart_restaurant', JSON.stringify(restaurant));
    }
    if (cart?.length > 0) {
      const is_true = cart[0].id_restaurant !== newItem.id_restaurant;
      if (is_true) {
        setCartClearModel(true);
      }
    }

    setCart(prev => {
      const existingDishIndex = prev.findIndex(item => item.menu_id === newItem.menu_id);

      let updatedCart;

      if (existingDishIndex !== -1) {
        updatedCart = prev.map((dish) => {
          if (dish.menu_id === newItem.menu_id) {
            return {
              ...dish,
              quantity: dish.quantity + 1
            };
          }
          return dish;
        });
      } else {
        const itemWithQuantity = { ...newItem, quantity: 1 };
        updatedCart = [...prev, itemWithQuantity];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
    toast('Added to cart!');

  };


  console.log(cart)





  const categories = [
    { id: 'veg', name: 'Veg', icon: '🥗', color: 'from-green-400 to-emerald-500' },
    { id: 'non-veg', name: 'Non-Veg', icon: '🍖', color: 'from-red-400 to-rose-500' },
  ];

  useEffect(() => {
    if (activeCategory === 'veg') {
      setMenu(vegMenu);
    }
    if (activeCategory === 'non-veg') {
      setMenu(nonVegMenu);
    }
  }, [activeCategory])

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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/20 backdrop-blur-lg' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">{restaurant?.restaurant_name || 'N/A'}</h1>
                  <p className="text-xs text-gray-300">Fine Dining Experience</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#menu" className="hover:text-orange-400 transition-colors">Menu</a>
                <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
                <a href="#reservations" className="hover:text-orange-400 transition-colors">Reservations</a>
                <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
                <Link to={'/cart'}>
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105">
                    Cart({cart?.length || 0})
                  </button>
                </Link>

              </div>

              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

          {/* Floating Food Elements */}
          <div className="absolute top-32 left-10 text-4xl animate-float">🍽️</div>
          <div className="absolute top-48 right-20 text-3xl animate-float delay-1000">🍷</div>
          <div className="absolute bottom-48 left-20 text-4xl animate-float delay-500">🥘</div>
          <div className="absolute bottom-32 right-16 text-3xl animate-float delay-1500">🍾</div>

          <div className="relative z-10 text-center max-w-5xl mx-auto">


            <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {restaurant?.restaurant_name || 'N/A'}
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center gap-3">
                <Utensils className="w-5 h-5" />
                View Menu
              </button>
            </div>


          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-20 px-4 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Our Menu
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover our carefully curated selection of dishes, each prepared with the finest ingredients and utmost care
              </p>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} shadow-lg shadow-orange-500/25 scale-105`
                    : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20'
                    }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            {
              menu.length === 0 &&
              <h1 className='text-xl text-center items-center flex justify-center'>There are no items available in this catogery!</h1>
            }
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {menu?.map((dish) => (
                <div key={dish.menu_id} className="group bg-white/10 backdrop-blur-lg rounded-3xl z-40 p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      <img src={`${dish.image}`} alt="" />
                    </div>
                    <div className="flex items-center gap-2">
                      {dish.chef && (
                        <div className="bg-orange-500 p-1.5 rounded-full" title="Chef's Special">
                          <ChefHat className="w-4 h-4" />
                        </div>
                      )}
                      {dish.spicy && (
                        <div className="bg-red-500 p-1.5 rounded-full" title="Spicy">
                          <span className="text-xs">🌶️</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {dish.menu_name}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Enhanced Nutritional Stats Section */}
                  <div className="mb-4 z-50 p-4 bg-gradient-to-r from-black/20 to-black/30 rounded-2xl border border-white/10 backdrop-blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Nutrition Facts</span>
                    </div>

                    {/* Main Calorie Display */}
                    <div className="text-center mb-3 p-3 bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-xl border border-orange-400/40">
                      <div className="text-3xl font-bold text-orange-300">{dish.calories}</div>
                      <div className="text-xs text-orange-200 uppercase tracking-wide">Calories</div>
                    </div>

                    {/* Primary Nutrition Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {/* Protein */}
                      <div className="text-center p-2 bg-blue-500/20 rounded-lg border border-blue-400/40">
                        <div className="text-lg font-bold text-blue-300">{dish.protein}g</div>
                        <div className="text-xs text-blue-200">Protein</div>
                      </div>

                      {/* Carbs */}
                      <div className="text-center p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/40">
                        <div className="text-lg font-bold text-yellow-300">{dish.carbohydrates}g</div>
                        <div className="text-xs text-yellow-200">Carbs</div>
                      </div>

                      {/* Fat */}
                      <div className="text-center p-2 bg-purple-500/20 rounded-lg border border-purple-400/40">
                        <div className="text-lg font-bold text-purple-300">{dish.fat}g</div>
                        <div className="text-xs text-purple-200">Fat</div>
                      </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {/* Fiber */}
                      <div className="text-center p-2 bg-green-500/20 rounded-lg border border-green-400/30">
                        <div className="text-sm font-semibold text-green-300">{dish.fiber}g</div>
                        <div className="text-xs text-green-200">Fiber</div>
                      </div>

                      {/* Cholesterol */}
                      <div className="text-center p-2 bg-red-500/20 rounded-lg border border-red-400/30">
                        <div className="text-sm font-semibold text-red-300">{dish.cholesterol}mg</div>
                        <div className="text-xs text-red-200">Cholesterol</div>
                      </div>
                    </div>

                    {/* Health Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {/* High Protein Badge */}
                      {parseInt(dish.protein) >= 20 && (
                        <div className="flex items-center gap-1 bg-blue-500/30 px-2 py-1 rounded-full border border-blue-400/50">
                          <Zap className="w-3 h-3 text-blue-300" />
                          <span className="text-xs text-blue-200 font-medium">High Protein</span>
                        </div>
                      )}

                      {/* High Fiber Badge */}
                      {parseFloat(dish.fiber) >= 3 && (
                        <div className="flex items-center gap-1 bg-green-500/30 px-2 py-1 rounded-full border border-green-400/50">
                          <Leaf className="w-3 h-3 text-green-300" />
                          <span className="text-xs text-green-200 font-medium">High Fiber</span>
                        </div>
                      )}

                      {/* Light Option Badge */}
                      {parseInt(dish.calories) <= 300 && (
                        <div className="flex items-center gap-1 bg-emerald-500/30 px-2 py-1 rounded-full border border-emerald-400/50">
                          <Feather className="w-3 h-3 text-emerald-300" />
                          <span className="text-xs text-emerald-200 font-medium">Light</span>
                        </div>
                      )}

                      {/* Low Fat Badge */}
                      {parseInt(dish.fat) <= 10 && (
                        <div className="flex items-center gap-1 bg-cyan-500/30 px-2 py-1 rounded-full border border-cyan-400/50">
                          <Shield className="w-3 h-3 text-cyan-300" />
                          <span className="text-xs text-cyan-200 font-medium">Low Fat</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${dish.category === 'veg'
                        ? 'bg-green-600/30 border-green-500/50'
                        : 'bg-red-600/30 border-red-500/50'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${dish.category === 'veg' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                        <span className={`text-xs font-medium ${dish.category === 'veg' ? 'text-green-200' : 'text-red-200'
                          }`}>
                          {dish.category === 'veg' ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Calorie Intensity Bar */}
                  <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/70">Calorie Level:</span>
                      <span className={`text-xs font-semibold ${parseInt(dish.calories) <= 200 ? 'text-green-400' :
                        parseInt(dish.calories) <= 400 ? 'text-yellow-400' :
                          parseInt(dish.calories) <= 600 ? 'text-orange-400' :
                            'text-red-400'
                        }`}>
                        {parseInt(dish.calories) <= 200 ? 'Low' :
                          parseInt(dish.calories) <= 400 ? 'Moderate' :
                            parseInt(dish.calories) <= 600 ? 'High' : 'Very High'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${parseInt(dish.calories) <= 200 ? 'bg-green-400 w-1/4' :
                            parseInt(dish.calories) <= 400 ? 'bg-yellow-400 w-2/4' :
                              parseInt(dish.calories) <= 600 ? 'bg-orange-400 w-3/4' :
                                'bg-red-400 w-full'
                            }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Add to Cart Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-400">
                        ₹{dish.price}
                      </span>
                      {/* Availability Indicator */}
                      {dish.availability && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Available</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { addToCart(dish) }}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 flex items-center gap-2 hover:from-orange-400 hover:to-pink-400"
                    >
                      Add to Cart <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Footer */}
        <footer className="bg-black/40 backdrop-blur-lg py-12 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Bella Vista</h3>
                    <p className="text-xs text-gray-400">Fine Dining Experience</p>
                  </div>
                </div>
                <p className="text-gray-400">Creating memorable dining experiences since 2001.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-orange-400">Quick Links</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer transition-colors">Menu</div>
                  <div className="hover:text-white cursor-pointer transition-colors">Reservations</div>
                  <div className="hover:text-white cursor-pointer transition-colors">Private Events</div>
                  <div className="hover:text-white cursor-pointer transition-colors">Gift Cards</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-orange-400">Contact</h4>
                <div className="space-y-2 text-gray-400">
                  <div>123 Fine Dining Street</div>
                  <div>Bhopal, MP 462001</div>
                  <div>+91 98765 43210</div>
                  <div>info@bellavista.com</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-orange-400">Follow Us</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer transition-colors">Instagram</div>
                  <div className="hover:text-white cursor-pointer transition-colors">Facebook</div>
                  <div className="hover:text-white cursor-pointer transition-colors">Twitter</div>
                  <div className="hover:text-white cursor-pointer transition-colors">TripAdvisor</div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Bella Vista Restaurant. All rights reserved. Crafted with <Heart className="w-4 h-4 inline text-red-500" /> for food lovers.</p>
            </div>
          </div>
        </footer>

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
      {
        cartClearModel &&
        <CartClearModel setCartClearModel={setCartClearModel} addToCart={addToCart} setCart={setCart} />
      }
    </>

  );
}