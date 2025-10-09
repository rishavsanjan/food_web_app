import { useState } from 'react';
import { CheckCircle, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const [showAnimation, setShowAnimation] = useState(true);
  const location = useLocation();
  const navigate = useNavigate()
  const { cart } = location.state || {};
  console.log(cart)

  const handleReturnToMenu = () => {
    console.log('Returning to menu...');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl">

        {/* Success Animation */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white transition-all duration-1000 ${showAnimation ? 'scale-110 animate-pulse' : ''}`}>
            <CheckCircle size={48} />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-3">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-white/80 text-sm">
            Thank you for your order! Your delicious meal is being prepared with care.
          </p>
        </div>

        {/* Order Details */}
        {/* <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/70 text-sm">Order ID</span>
            <span className="text-white font-mono text-sm">#{}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-white/70 text-sm">
              <Clock size={16} className="mr-2" />
              Delivery Time
            </div>
            <span className="text-white text-sm font-medium">45-60 mins</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-white/70 text-sm">
              <MapPin size={16} className="mr-2" />
              Total Amount
            </div>
            <span className="text-green-400 font-bold">₹1,825</span>
          </div>
        </div> */}

        {/* Status */}
        <div className="bg-orange-500/20 rounded-xl p-3 mb-6 border border-orange-400/30">
          <div className="flex items-center justify-center text-orange-300">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium">Order Confirmed - Preparing your meal</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {navigate('/')}}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 cursor-pointer text-white font-semibold py-3 px-6 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft size={18} className="inline mr-2" />
            Return to Home
          </button>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/60 text-xs">
            You will receive SMS updates about your order status
          </p>
        </div> */}
      </div>
    </div>
  );
}