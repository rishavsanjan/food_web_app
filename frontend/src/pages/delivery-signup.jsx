import { useState } from 'react';
import { Bike, Eye, EyeOff, Lock, Phone, ArrowLeft, AlertCircle, User, Mail, MapPin } from 'lucide-react';

export default function DeliverySignup() {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        vehicleType: 'bike',
        vehicleNumber: '',
        licenseNumber: '',
        address: ''
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

    const validateLogin = () => {
        const cleanPhone = formData.phone.replace(/\D/g, '');
        const newErrors = {};

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(cleanPhone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignup = () => {
        const cleanPhone = formData.phone.replace(/\D/g, '');
        const newErrors = {};

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(cleanPhone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Additional signup fields validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.vehicleNumber.trim()) {
            newErrors.vehicleNumber = 'Vehicle number is required';
        }

        if (!formData.licenseNumber.trim()) {
            newErrors.licenseNumber = 'License number is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateLogin()) return;

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Login successful:', {
                phone: formData.phone,
                method: 'password'
            });

            alert('Login successful! Welcome back!');

        } catch (error) {
            setErrors({ submit: 'Login failed. Please check your credentials and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!validateSignup()) return;

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Signup successful:', formData);
            alert('Signup successful! Your account is pending verification. You will be able to login once approved.');

            // Reset form after successful signup
            setFormData({
                phone: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                email: '',
                vehicleType: 'bike',
                vehicleNumber: '',
                licenseNumber: '',
                address: ''
            });

        } catch (error) {
            setErrors({ submit: 'Signup failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const switchAuthMode = () => {
        setAuthMode(authMode === 'login' ? 'signup' : 'login');
        setErrors({});
        setFormData({
            phone: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            email: '',
            vehicleType: 'bike',
            vehicleNumber: '',
            licenseNumber: '',
            address: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🏍️</div>
            <div className="absolute top-40 right-20 text-3xl animate-float-delayed opacity-20">📦</div>
            <div className="absolute bottom-40 left-20 text-4xl animate-float-more-delayed opacity-20">🛵</div>
            <div className="absolute bottom-20 right-10 text-3xl animate-float-most-delayed opacity-20">🚴</div>

            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                <Bike className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                FitEats Delivery
                            </h1>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            {authMode === 'login' ? 'Welcome Back' : 'Join Our Fleet'}
                        </h2>
                        <p className="text-gray-300">
                            {authMode === 'login'
                                ? 'Sign in to start delivering'
                                : 'Sign up to become a delivery partner'}
                        </p>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                {authMode === 'login' ? 'Login to Your Account' : 'Create Delivery Account'}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {authMode === 'login'
                                    ? 'Enter your phone number and password to continue'
                                    : 'Fill in your details to get started'}
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Phone Number Field */}
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
                                            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
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
                                        className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'
                                            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
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
                                {authMode === 'login' && (
                                    <div className="text-right mt-2">
                                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password (Signup Only) */}
                            {authMode === 'signup' && (
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
                                                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
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
                            )}

                            {/* Additional Signup Fields */}
                            {authMode === 'signup' && (
                                <div className="space-y-4 border-t border-white/20 pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.fullName}</p>
                                            </div>
                                        )}
                                    </div>

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
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                placeholder="john@example.com"
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
                                            Vehicle Type *
                                        </label>
                                        <div className="relative">
                                            <Bike className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <select
                                                name="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="bike" className="bg-gray-800">Bike</option>
                                                <option value="scooter" className="bg-gray-800">Scooter</option>
                                                <option value="bicycle" className="bg-gray-800">Bicycle</option>
                                                <option value="car" className="bg-gray-800">Car</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Vehicle Number *
                                        </label>
                                        <div className="relative">
                                            <Bike className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="vehicleNumber"
                                                value={formData.vehicleNumber}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.vehicleNumber ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                placeholder="MH12AB1234"
                                            />
                                        </div>
                                        {errors.vehicleNumber && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.vehicleNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            License Number *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.licenseNumber ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                placeholder="DL1234567890123"
                                            />
                                        </div>
                                        {errors.licenseNumber && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.licenseNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Address *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/20'
                                                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none`}
                                                placeholder="Enter your full address"
                                            />
                                        </div>
                                        {errors.address && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                <p className="text-red-400 text-xs">{errors.address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="flex items-center gap-1 bg-red-500/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <p className="text-red-400 text-sm">{errors.submit}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={authMode === 'login' ? handleLogin : handleSignup}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                                    </span>
                                ) : (
                                    authMode === 'login' ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Toggle Auth Mode */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={switchAuthMode}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    {/* Back to Website */}
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