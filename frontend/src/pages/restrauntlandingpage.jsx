import { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Phone, Heart, ChefHat, Utensils, Wine, Coffee, Menu, X, ArrowRight, Award } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function RestaurantLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [scrollY, setScrollY] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [menu, setMenu] = useState([]);
  const {id} = useParams();

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
    console.log(response.data)

  }

  useEffect(() => {
    getMenu();  
  }, [])


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (dishId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
    } else {
      newFavorites.add(dishId);
    }
    setFavorites(newFavorites);
  };

  const categories = [
    { id: 'veg', name: 'Veg', icon: '🥗', color: 'from-green-400 to-emerald-500' },
    { id: 'non-veg', name: 'Non-Veg', icon: '🍖', color: 'from-red-400 to-rose-500' },
  ];

  const dishes = {
    appetizers: [
      { id: 1, name: "Truffle Arancini", description: "Crispy risotto balls with truffle oil and parmesan", price: "₹850", image: "🧀", chef: true, spicy: false },
      { id: 2, name: "Burrata Caprese", description: "Fresh burrata with heirloom tomatoes and basil", price: "₹950", image: "🍅", chef: false, spicy: false },
      { id: 3, name: "Crispy Calamari", description: "Golden fried squid with spicy marinara sauce", price: "₹750", image: "🦑", chef: false, spicy: true },
      { id: 4, name: "Beef Carpaccio", description: "Thinly sliced beef with rocket and parmesan", price: "₹1200", image: "🥩", chef: true, spicy: false }
    ],
    mains: [
      { id: 5, name: "Wagyu Ribeye", description: "Premium Japanese beef with roasted vegetables", price: "₹3500", image: "🥩", chef: true, spicy: false },
      { id: 6, name: "Lamb Rack", description: "Herb-crusted lamb with mint jus", price: "₹2800", image: "🍖", chef: true, spicy: false },
      { id: 7, name: "Duck Confit", description: "Slow-cooked duck leg with cherry gastrique", price: "₹2200", image: "🦆", chef: true, spicy: false },
      { id: 8, name: "Chicken Parmigiana", description: "Breaded chicken with marinara and mozzarella", price: "₹1650", image: "🍗", chef: false, spicy: false }
    ],
    pasta: [
      { id: 9, name: "Lobster Ravioli", description: "House-made pasta with lobster in cream sauce", price: "₹1850", image: "🦞", chef: true, spicy: false },
      { id: 10, name: "Truffle Carbonara", description: "Classic carbonara with black truffle shavings", price: "₹1450", image: "🍝", chef: true, spicy: false },
      { id: 11, name: "Margherita Pizza", description: "San Marzano tomatoes, buffalo mozzarella, basil", price: "₹1200", image: "🍕", chef: false, spicy: false },
      { id: 12, name: "Diavola Pizza", description: "Spicy salami, chili flakes, mozzarella", price: "₹1350", image: "🌶️", chef: false, spicy: true }
    ],
    seafood: [
      { id: 13, name: "Grilled Salmon", description: "Atlantic salmon with lemon herb butter", price: "₹2200", image: "🐟", chef: true, spicy: false },
      { id: 14, name: "Seafood Risotto", description: "Creamy arborio rice with mixed seafood", price: "₹1950", image: "🦐", chef: true, spicy: false },
      { id: 15, name: "Pan-Seared Scallops", description: "Caramelized scallops with cauliflower purée", price: "₹2800", image: "🐚", chef: true, spicy: false },
      { id: 16, name: "Grilled Prawns", description: "Tiger prawns with garlic and herbs", price: "₹1750", image: "🦐", chef: false, spicy: true }
    ],
    desserts: [
      { id: 17, name: "Tiramisu", description: "Classic Italian dessert with mascarpone", price: "₹650", image: "🍰", chef: true, spicy: false },
      { id: 18, name: "Chocolate Soufflé", description: "Warm chocolate soufflé with vanilla ice cream", price: "₹750", image: "🍫", chef: true, spicy: false },
      { id: 19, name: "Panna Cotta", description: "Vanilla panna cotta with berry compote", price: "₹550", image: "🍮", chef: false, spicy: false },
      { id: 20, name: "Gelato Selection", description: "Three scoops of artisanal Italian gelato", price: "₹450", image: "🍨", chef: false, spicy: false }
    ],
    beverages: [
      { id: 21, name: "Signature Cocktail", description: "House special with premium spirits", price: "₹850", image: "🍸", chef: false, spicy: false },
      { id: 22, name: "Wine Selection", description: "Curated wines from around the world", price: "₹650", image: "🍷", chef: false, spicy: false },
      { id: 23, name: "Fresh Juice", description: "Seasonal fruit juices made to order", price: "₹350", image: "🥤", chef: false, spicy: false },
      { id: 24, name: "Italian Coffee", description: "Authentic espresso, cappuccino, or latte", price: "₹250", image: "☕", chef: false, spicy: false }
    ]
  };

  return (
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Bella Vista</h1>
                <p className="text-xs text-gray-300">Fine Dining Experience</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#menu" className="hover:text-orange-400 transition-colors">Menu</a>
              <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
              <a href="#reservations" className="hover:text-orange-400 transition-colors">Reservations</a>
              <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105">
                Book Table
              </button>
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
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <span className="ml-2 text-yellow-400 font-semibold">Michelin Recommended</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Bella Vista
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-gray-200 font-light">
            Where Culinary Art Meets Fine Dining
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience exquisite flavors crafted by our award-winning chefs in an atmosphere of elegance and sophistication. Every dish tells a story of passion and perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center gap-3">
              <Utensils className="w-5 h-5" />
              View Menu
            </button>
            <button className="border-2 border-white/30 px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all transform hover:scale-105 flex items-center gap-3">
              <Phone className="w-5 h-5" />
              Reserve Table
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Award Winning</h3>
              <p className="text-gray-300 text-sm">Recognized by culinary experts worldwide</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <ChefHat className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Master Chefs</h3>
              <p className="text-gray-300 text-sm">Led by internationally trained culinary artists</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <Wine className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fine Wines</h3>
              <p className="text-gray-300 text-sm">Curated selection from premium vineyards</p>
            </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes[activeCategory]?.map((dish) => (
              <div key={dish.id} className="group bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {dish.image}
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
                    <button
                      onClick={() => toggleFavorite(dish.id)}
                      className={`p-1.5 rounded-full transition-colors ${favorites.has(dish.id)
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/20 text-gray-300 hover:bg-pink-500 hover:text-white'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(dish.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {dish.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-400">
                    {dish.price}
                  </span>
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 flex items-center gap-2">
                    Add to Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto mb-20">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg"
              alt="Elegant restaurant interior with fine dining setup"
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Fine Dining
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Where Every Meal is a Masterpiece
                </p>
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">
                  Experience Excellence
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                About Bella Vista
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Nestled in the heart of the city, Bella Vista has been serving exceptional cuisine for over two decades. Our commitment to quality, innovation, and service has earned us recognition from food critics and diners alike.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Every dish is crafted with passion, using only the finest locally-sourced ingredients and time-honored techniques passed down through generations of culinary masters.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <Clock className="w-8 h-8 text-orange-400 mb-3" />
                  <h4 className="font-bold mb-2">Opening Hours</h4>
                  <p className="text-sm text-gray-300">
                    Mon-Sat: 6:00 PM - 11:00 PM<br />
                    Sun: 6:00 PM - 10:00 PM
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <MapPin className="w-8 h-8 text-pink-400 mb-3" />
                  <h4 className="font-bold mb-2">Location</h4>
                  <p className="text-sm text-gray-300">
                    123 Fine Dining Street<br />
                    Bhopal, MP 462001
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-orange-400/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ChefHat className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Reserve Your Table</h3>
                  <p className="text-gray-300 mb-6">Experience fine dining at its finest</p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">
                    Book Now
                  </button>
                  <p className="text-sm text-gray-400 mt-4">
                    Call us: <span className="text-orange-400 font-semibold">+91 98765 43210</span>
                  </p>
                </div>
              </div>
            </div>
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
  );
}