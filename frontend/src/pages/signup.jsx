import { useState, useRef, useEffect } from 'react';
import { ChefHat, Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, ArrowRight, MapPin, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


import LiveLocationPicker from './maps';

import config from '../config/config';
import { useNavigate } from "react-router-dom";


export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const otpInputs = useRef([]);
  const [address, setAddress] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    addressDetails: '',
    address: '',
    lat: 23.2599,
    lng: 77.4126,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // OTP Timer
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 2 && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  const handleInputChange = (e) => {

    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  console.log(errors)

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);


    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      const completeOtp = [...newOtp.slice(0, 5), value].join('');
      if (completeOtp.length === 6) {
        setTimeout(() => handleVerifyOtp(completeOtp), 100);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpInputs.current[5]?.focus();

      // Clear error
      if (errors.otp) {
        setErrors(prev => ({ ...prev, otp: '' }));
      }

      // Auto-submit
      setTimeout(() => handleVerifyOtp(pastedData), 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        otpInputs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleSendOtp = async () => {

    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {

      const response = await axios({
        url: `${config.apiUrl}/api/users/signup-otp`,
        method: 'post',
        data: {
          phone: formData.phone
        }
      })
      toast.success('OTP Sent Successfuly!')
      console.log(response.data);
      setGeneratedOtp(response.data.otp);


      setStep(2);
      setTimer(60);
      setCanResend(false);
      setOtpAttempts(0);
      setOtp(['', '', '', '', '', '']);

    } catch (error) {
      setErrors({ phone: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue = null) => {
    const otpToVerify = otpValue || otp.join('');

    if (otpToVerify.length !== 6) {
      setErrors({ otp: 'Please enter complete 6-digit OTP' });
      return;
    }

    // Check max attempts
    if (otpAttempts >= 3) {
      setErrors({ otp: 'Too many failed attempts. Please request a new OTP.' });
      return;
    }

    setLoading(true);

    try {
      if (generatedOtp === otpToVerify) {
        setErrors({});
        setStep(3);
        setOtpAttempts(0);
        toast.success('OTP Verified!')
      } else {
        toast.error('Wrong OTP!')
        setOtpAttempts(prev => prev + 1);
        const remainingAttempts = 3 - (otpAttempts + 1);

        if (remainingAttempts > 0) {
          setErrors({
            otp: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
          });
        } else {
          setErrors({
            otp: 'Too many failed attempts. Please request a new OTP.'
          });
        }

        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    setOtpAttempts(0);

    try {

      const response = await axios({
        url: `${config.apiUrl}/api/users/signup-otp`,
        method: 'post',
        data: {
          phone: formData.phone
        }
      })
      setGeneratedOtp(response.data.otp);


      setTimer(60);
      setCanResend(false);
      otpInputs.current[0]?.focus();

    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    return errors;
  };

  const handleDetailsSubmit = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (formData.email.length > 0)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordErrors = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    const newErrors = {};

    if (!address || address === 'Fetching address...') {
      newErrors.address = 'Please wait for address to load';
      setErrors(newErrors);
      return;
    }

    if (!formData.addressDetails.trim()) {
      newErrors.addressDetails = 'Please provide additional address details (floor, apartment, etc.)';
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      const response = await axios({
        url: `${config.apiUrl}/api/users/signup`,
        method: 'post',
        data: {
          name: formData.name,
          phone_number: formData.phone,
          email: formData.email,
          password: formData.password,
          location: formData.address,
          address: formData.addressDetails,
          lat: formData.lat,
          long: formData.lng
        }
      })

      
      console.log(response.data)
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/login')
      }, 1000);

    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log(formData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
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
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🍽️</div>
      <div className="absolute top-40 right-20 text-3xl animate-float-delayed opacity-20">🍷</div>
      <div className="absolute bottom-40 left-20 text-4xl animate-float-more-delayed opacity-20">🥘</div>
      <div className="absolute bottom-20 right-10 text-3xl animate-float-most-delayed opacity-20">🍾</div>

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                FitEats
              </h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-white/10'
                    }`}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${step > s ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-white/10'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-21 mt-2 text-xs text-gray-400">
              <span>Phone</span>
              <span className='pl-1'>OTP</span>
              <span>Details</span>
              <span className='pr-16'>Address</span>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Step 1: Phone Number */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Welcome to FitEats
                  </h2>
                  <p className="text-gray-300">Enter your phone number to get started</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) { // only digits allowed
                            setFormData({ ...formData, phone: value });
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendOtp();
                        }}
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

                  <button
                    onClick={handleSendOtp}
                    disabled={loading || formData.phone.length < 10}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending OTP...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button className="text-orange-400 hover:text-orange-300 font-semibold">
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Verify OTP
                  </h2>
                  <p className="text-gray-300">
                    Enter the 6-digit code sent to<br />
                    <span className="font-semibold">{formData.phone}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={el => otpInputs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          disabled={loading}
                          className="w-12 h-12 text-center text-2xl font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{errors.otp}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-gray-400 text-sm">
                        Resend OTP in <span className="font-semibold text-orange-400">{formatTime(timer)}</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Resending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleVerifyOtp()}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setErrors({});
                      setOtpAttempts(0);
                    }}
                    className="w-full text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change Number
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: User Details */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Complete Your Profile
                  </h2>
                  <p className="text-gray-300">Tell us a bit about yourself</p>
                </div>

                <div className="space-y-4">
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
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'
                          } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <p className="text-red-400 text-xs">{errors.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address (optional)
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
                      <div className="flex items-start gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-400 mt-0.5" />
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

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-tight">
                      I agree to the <span className="text-orange-400 hover:text-orange-300 cursor-pointer">Terms of Service</span> and <span className="text-orange-400 hover:text-orange-300 cursor-pointer">Privacy Policy</span> *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>
                    </div>
                  )}

                  <button
                    onClick={handleDetailsSubmit}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Address Selection */}
            {step === 4 && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Select Your Location
                  </h2>
                  <p className="text-gray-300 text-sm">Pin your exact delivery address</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={address || 'Fetching address...'}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address Details (Flat, Floor, Building) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="addressDetails"
                        value={formData.addressDetails}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.addressDetails ? 'border-red-500' : 'border-white/20'
                          } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                        placeholder="Flat 301, Tower A"
                      />
                    </div>
                    {errors.addressDetails && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <p className="text-red-400 text-xs">{errors.addressDetails}</p>
                      </div>
                    )}
                  </div>

                  <div
                    className="w-full h-64 rounded-xl overflow-hidden border border-white/20"
                  >
                    <LiveLocationPicker
                      lat={formData.lat}
                      lng={formData.lng}
                      address={address}
                      setAddress={setAddress}
                      setFormData={setFormData}
                    />
                  </div>

                  {address && address !== 'Fetching address...' && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/20">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-orange-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Selected Address:</p>
                          <p className="text-white font-medium">{address}</p>
                          {formData.addressDetails && (
                            <p className="text-gray-300 text-sm mt-1">{formData.addressDetails}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.address && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{errors.address}</p>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        Complete Signup
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Back to Website */}
          <div className="text-center mt-6">
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