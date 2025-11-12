import { useState, useRef, useEffect } from 'react';
import { ChefHat, Eye, EyeOff, Lock, Phone, ArrowLeft, AlertCircle, User, Mail, MapPin, Store } from 'lucide-react';
import LiveLocationPicker from './maps';
import axios from 'axios';

export default function RestaurantSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [isLogin, setIsLogin] = useState(false); // Toggle between login/signup

    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        fssaiLicense: '',
        gstNumber: '',
        password: '',
        confirmPassword: '',
        lat: null,
        lng: null,
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const cleanPhone = formData.phone.replace(/\D/g, '');

        if (!formData.restaurantName.trim()) {
            newErrors.restaurantName = 'Restaurant name is required';
        }

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = 'Owner name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(cleanPhone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        if (!formData.fssaiLicense.trim()) {
            newErrors.fssaiLicense = 'FSSAI License is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const validateLoginForm = () => {
        const newErrors = {};

        if (!loginData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSignup = async () => {
        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const response = await axios({
            url: '',
            method: 'post',
            data: {
                
            }
        })

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Restaurant registered successfully!');
            alert('Restaurant registered successfully! Please login to continue.');
            // Reset form
            setFormData({
                restaurantName: '',
                ownerName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                fssaiLicense: '',
                gstNumber: '',
                password: '',
                confirmPassword: '',
                lat: null,
                lng: null,
            });
        } catch (error) {
            setErrors({ submit: 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        const newErrors = validateLoginForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Login successful!');
            alert('Login successful! Welcome back.');
            // Reset login form
            setLoginData({
                email: '',
                password: ''
            });
        } catch (error) {
            setErrors({ submit: 'Login failed. Please check your credentials.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
            <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🍽️</div>
            <div className="absolute top-40 right-20 text-3xl animate-float-delayed opacity-20">🍷</div>
            <div className="absolute bottom-40 left-20 text-4xl animate-float-more-delayed opacity-20">🥘</div>
            <div className="absolute bottom-20 right-10 text-3xl animate-float-most-delayed opacity-20">🍾</div>

            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                FitEats
                            </h1>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            {isLogin ? 'Welcome Back' : 'Partner With Us'}
                        </h2>
                        <p className="text-gray-300">
                            {isLogin ? 'Sign in to your restaurant account' : 'Register your restaurant and start serving customers'}
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/20 mb-6">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${!isLogin
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                Sign Up
                            </button>
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isLogin
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Lock className="w-4 h-4" />
                                Sign In
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                        {!isLogin ? (
                            // Sign Up Form
                            <div>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                        Restaurant Registration
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Fill in your restaurant details to get started
                                    </p>
                                </div>

                                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Restaurant Name *
                                            </label>
                                            <div className="relative">
                                                <Store className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="restaurantName"
                                                    value={formData.restaurantName}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.restaurantName ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                    placeholder="Your Restaurant"
                                                />
                                            </div>
                                            {errors.restaurantName && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.restaurantName}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Owner Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="ownerName"
                                                    value={formData.ownerName}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.ownerName ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            {errors.ownerName && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.ownerName}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                    placeholder="restaurant@example.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.email}</p>
                                                </div>
                                            )}
                                        </div>

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
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                    placeholder="98765 43210"
                                                    maxLength="10"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Restaurant Address *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-24 py-3 bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                placeholder="Street address"
                                            />
                                        </div>
                                        <div className='my-4'>
                                            <LiveLocationPicker
                                                lat={formData.lat}
                                                lng={formData.lng}
                                                address={address}
                                                setAddress={setAddress}
                                                setFormData={setFormData}
                                            />
                                        </div>

                                        {errors.address && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.address}</p>
                                            </div>
                                        )}
                                        {formData.latitude && formData.longitude && (
                                            <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Location selected ({formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                placeholder="City"
                                            />
                                            {errors.city && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.city}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.state ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                placeholder="State"
                                            />
                                            {errors.state && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.state}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.pincode ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                placeholder="123456"
                                                maxLength="6"
                                            />
                                            {errors.pincode && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.pincode}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
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
                                                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
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
                                            {errors.password && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.password}</p>
                                                </div>
                                            )}
                                        </div>

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
                                                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
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
                                            {errors.confirmPassword && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                                    <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {errors.submit && (
                                        <div className="flex items-center gap-1 bg-red-500/10 p-3 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                            <p className="text-red-400 text-sm">{errors.submit}</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleSignup}
                                    disabled={loading}
                                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        ) : (
                            // Login Form
                            <div>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                        Restaurant Login
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Sign in to your restaurant account
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginInputChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                                                placeholder="restaurant@example.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.email}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginInputChange}
                                                className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
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
                                        {errors.password && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.password}</p>
                                            </div>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="flex items-center gap-1 bg-red-500/10 p-3 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                            <p className="text-red-400 text-sm">{errors.submit}</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing In...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <button className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                                        Forgot your password?
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    <div className="text-center mt-4">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mx-auto">
                            <ArrowLeft className="w-4 h-4" />
                            Back to FitEats
                        </button>
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
                .animate-float-delayed {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-float-more-delayed {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                .animate-float-most-delayed {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
            `}</style>
        </div>
    );
}