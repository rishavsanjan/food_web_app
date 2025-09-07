import { useState } from 'react';
import { ChefHat, Plus, Minus, Trash2, ArrowLeft, Clock, MapPin, CreditCard, ShoppingBag, Star, Heart, Gift, Percent } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wagyu Ribeye",
      description: "Premium Japanese beef with roasted vegetables",
      price: 3500,
      quantity: 1,
      image: "🥩",
      category: "Main Course",
      chef: true,
      spicy: false,
      customizations: ["Medium rare", "Extra herbs"]
    },
    {
      id: 2,
      name: "Truffle Carbonara",
      description: "Classic carbonara with black truffle shavings",
      price: 1450,
      quantity: 2,
      image: "🍝",
      category: "Pasta",
      chef: true,
      spicy: false,
      customizations: ["Extra truffle", "No bacon"]
    },
    {
      id: 3,
      name: "Lobster Ravioli",
      description: "House-made pasta with lobster in cream sauce",
      price: 1850,
      quantity: 1,
      image: "🦞",
      category: "Pasta",
      chef: true,
      spicy: false,
      customizations: []
    },
    {
      id: 4,
      name: "Tiramisu",
      description: "Classic Italian dessert with mascarpone",
      price: 650,
      quantity: 2,
      image: "🍰",
      category: "Dessert",
      chef: true,
      spicy: false,
      customizations: ["Extra cocoa powder"]
    },
    {
      id: 5,
      name: "Signature Cocktail",
      description: "House special with premium spirits",
      price: 850,
      quantity: 1,
      image: "🍸",
      category: "Beverage",
      chef: false,
      spicy: false,
      customizations: ["Less ice", "Extra garnish"]
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryType] = useState('delivery'); // delivery or pickup
  const [specialInstructions, setSpecialInstructions] = useState('');

  const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', description: 'Welcome offer - 10% off' },
    'SAVE500': { discount: 500, type: 'fixed', description: 'Save ₹500 on orders above ₹2000' },
    'CHEF20': { discount: 20, type: 'percentage', description: "Chef's special - 20% off" }
  };

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()]
      });
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Bella Vista
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
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-3xl animate-float opacity-20">🍽️</div>
      <div className="absolute top-40 right-20 text-2xl animate-float delay-1000 opacity-20">🍷</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-float delay-500 opacity-20">🥘</div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Bella Vista
                </h1>
                <p className="text-sm text-gray-400">Your Cart</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold">{getTotalItems()} Items</p>
            <p className="text-sm text-gray-400">₹{calculateTotal().toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                Delivery Options
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === 'delivery' 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚚</div>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-gray-400">45-60 mins</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === 'pickup' 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏪</div>
                    <p className="font-semibold">Pickup</p>
                    <p className="text-sm text-gray-400">20-30 mins</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.image}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            {item.chef && (
                              <div className="bg-orange-500 p-1 rounded-full" title="Chef's Special">
                                <ChefHat className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
                          <p className="text-xs text-orange-400">{item.category}</p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.customizations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Customizations:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.customizations.map((custom, index) => (
                              <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                {custom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-400">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          )}
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

            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Order Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
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
                
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">
                  Proceed to Checkout
                </button>
                
                <button className="w-full border-2 border-white/30 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h4 className="font-bold">Bella Vista</h4>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-400 ml-1">(4.9) • 2.5 km</span>
              </div>
              <p className="text-xs text-gray-400">
                123 Fine Dining Street, Bhopal<br/>
                +91 98765 43210
              </p>
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