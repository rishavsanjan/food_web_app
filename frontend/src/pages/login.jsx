import { useState } from 'react';
import { ChefHat, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowLeft, Star, Heart, HouseIcon, ClipboardTypeIcon, Building2, LucideBuilding2 } from 'lucide-react';
import axios from 'axios'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    console.log('hello')
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'First name is required';
      //if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      //if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Please agree to terms and conditions';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isLogin) {
      const response = await axios({
        url: 'http://localhost:3000/api/users/login',
        method: 'POST',
        data: {
          phone_number: formData.phone,
          password: formData.password,
        }
      })
      console.log(response.data)
      localStorage.setItem('token', response.data.msg);
      navigate('/');
    } else {

      const response = await axios({
        url: 'http://localhost:3000/api/users/signup',
        method: 'POST',
        data: {
          name: formData.name,
          phone_number: formData.phone,
          email: formData.email,
          password: formData.password,
          address: formData.address + ',' + formData.city + ',' + formData.state,
          city:formData.city + ',' + formData.state
        }
      })
      setIsLogin(true);
      console.log(response.data)
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
      alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      //lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      //birthDate: '',
      agreeToTerms: false,
      subscribeNewsletter: false
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🍽️</div>
      <div className="absolute top-40 right-20 text-3xl animate-float delay-1000 opacity-20">🍷</div>
      <div className="absolute bottom-40 left-20 text-4xl animate-float delay-500 opacity-20">🥘</div>
      <div className="absolute bottom-20 right-10 text-3xl animate-float delay-1500 opacity-20">🍾</div>

      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
          <div className="relative z-10 text-center max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Bella Vista</h1>
                <p className="text-sm text-gray-300">Fine Dining Experience</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Welcome to Culinary Excellence
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join our exclusive community and enjoy personalized dining experiences, special offers, and priority reservations at Bella Vista.
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">VIP Reservations</h4>
                  <p className="text-sm text-gray-300">Priority booking for special occasions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <Heart className="w-6 h-6 text-pink-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Personalized Experience</h4>
                  <p className="text-sm text-gray-300">Tailored recommendations and preferences</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <ChefHat className="w-6 h-6 text-orange-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Exclusive Events</h4>
                  <p className="text-sm text-gray-300">Access to chef's table and wine tastings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Bella Vista</h1>
                </div>
              </div>
            </div>

            {/* Auth Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back' : 'Join Our Family'}
                </h2>
                <p className="text-gray-300">
                  {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    {/* Name Fields */}
                    {/* <div className="grid grid-cols-2 gap-4 "> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="John"
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                      </div> */}
                    {/* </div> */}





                    {/* Birth Date */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Birth Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.birthDate ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                        />
                      </div>
                      {errors.birthDate && <p className="text-red-400 text-xs mt-1">{errors.birthDate}</p>}
                    </div> */}
                    {/* Address Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <HouseIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="e.g. Hostel-9, MANIT Bhopal"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    {/* State Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <div className="relative">
                        <LucideBuilding2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="e.g. Madhya Pardesh"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    {/* City Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                          placeholder="e.g. Bhopal"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </>
                )}

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>


                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Checkboxes (Signup only) */}
                {!isLogin && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-tight">
                        I agree to the <span className="text-orange-400 hover:text-orange-300 cursor-pointer">Terms of Service</span> and <span className="text-orange-400 hover:text-orange-300 cursor-pointer">Privacy Policy</span> *
                      </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>}

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="subscribeNewsletter"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                      />
                      <label htmlFor="subscribeNewsletter" className="text-sm text-gray-300 leading-tight">
                        Subscribe to our newsletter for exclusive offers and culinary updates
                      </label>
                    </div>
                  </div>
                )}

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                {/* Toggle Mode */}
                <div className="text-center">
                  <p className="text-gray-300">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Back to Website */}
            <div className="text-center mt-6">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mx-auto">
                <ArrowLeft className="w-4 h-4" />
                Back to Bella Vista
              </button>
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