import { useState, useRef, useEffect } from 'react';
import { ChefHat, Eye, EyeOff, Lock, Phone, ArrowLeft, Check, AlertCircle, KeyRound } from 'lucide-react';
import axios from 'axios';
import config from '../config/config';
import { useUser } from '../contexts/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [step, setStep] = useState(1); // 1: Phone/Password, 2: OTP Verification
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const otpInputs = useRef([]);
  const { getProfile } = useUser();


  const [formData, setFormData] = useState({
    phone: '',
    password: '',
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

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

      if (errors.otp) {
        setErrors(prev => ({ ...prev, otp: '' }));
      }

      setTimeout(() => handleVerifyOtp(pastedData), 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputs.current[index - 1]?.focus();
      } else {
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

  const handlePasswordLogin = async () => {
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

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await axios({
        url: `${config.apiUrl}/api/users/login-password`,
        method: 'POST',
        data: {
          phone_number: formData.phone,
          password: formData.password,
        }
      });

      console.log(response.data)

      if (response.status === 200 && response.data.success) {
        toast.success('Logged in successfully!');
        localStorage.setItem('token', response.data.msg);

        await getProfile();

        setTimeout(() => {
          if (response.data.role === 'CUSTOMER') {
            navigate('/');
          }
          if (response.data.role === 'RESTAURANT_OWNER') {
            navigate('/');
          }
          if (response.data.role === 'DELIVERY_AGENT') {
            navigate('/delivery-pofile');
          }

        }, 500);
        setLoading(false);
      } else {
        toast.error(`${response.data.msg}`)
      }

    } catch (error) {
      toast.error('Invalid Credentials!')
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const cleanPhone = formData.phone.replace(/\D/g, '');

    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios({
        url: `${config.apiUrl}/api/users/login-otp`,
        method: 'post',
        data: {
          phone: formData.phone
        }
      })
      setGeneratedOtp(response.data.otp);
      console.log(response.data);

      if (response.status === 200 && response.data.success) {
        toast.success('OTP Sent Successfully!')
      } else {
        toast.error(`${response.data.error}`)
        return;
      }

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

    if (otpAttempts >= 3) {
      setErrors({ otp: 'Too many failed attempts. Please request a new OTP.' });
      return;
    }

    setLoading(true);

    try {

      if (generatedOtp === otpToVerify) {
        setErrors({});
        setOtpAttempts(0);
        const response = await axios({
          url: `${config.apiUrl}/api/users/confirm-login-otp`,
          method: 'POST',
          data: {
            phonenumber: formData.phone,
          }
        });
        console.log(response.data)
        if (response.status === 200 && response.data.success) {
          toast.success('Logged in successfully!');
          localStorage.setItem('token', response.data.msg);

          await getProfile();

          setTimeout(() => {
            if (response.data.role === 'CUSTOMER') {
              navigate('/');
            }
            if (response.data.role === 'RESTAURANT_OWNER') {
              navigate('/');
            }
            if (response.data.role === 'DELIVERY_AGENT') {
              navigate('/delivery-pofile');
            }

          }, 500);
          setLoading(false);
        } else {
          toast.error(`${response.data.msg}`)
        }

      } else {
        toast.error('Wrong OTP!')
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);

      console.log('New OTP:', mockOtp);

      setTimer(60);
      setCanResend(false);
      otpInputs.current[0]?.focus();

    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const switchLoginMethod = () => {
    setLoginMethod(loginMethod === 'password' ? 'otp' : 'password');
    setStep(1);
    setErrors({});
    setFormData({ ...formData, password: '' });
    setOtp(['', '', '', '', '', '']);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to continue to your account</p>
          </div>

          {/* Login Method Toggle */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/20 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginMethod !== 'password' && switchLoginMethod()}
                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${loginMethod === 'password'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Lock className="w-4 h-4" />
                Password
              </button>
              <button
                onClick={() => loginMethod !== 'otp' && switchLoginMethod()}
                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${loginMethod === 'otp'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <KeyRound className="w-4 h-4" />
                OTP
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Step 1: Phone & Password/OTP Request */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    {loginMethod === 'password' ? 'Login with Password' : 'Login with OTP'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {loginMethod === 'password'
                      ? 'Enter your phone number and password'
                      : 'We\'ll send you a one-time password'}
                  </p>
                </div>

                <div className="space-y-5">
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
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            loginMethod === 'password' ? handlePasswordLogin() : handleSendOtp();
                          }
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

                  {loginMethod === 'password' && (
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
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handlePasswordLogin();
                          }}
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
                      <div className="text-right mt-2">
                        <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="flex items-center gap-1 bg-red-500/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    onClick={loginMethod === 'password' ? handlePasswordLogin : handleSendOtp}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {loginMethod === 'password' ? 'Signing In...' : 'Sending OTP...'}
                      </span>
                    ) : (
                      loginMethod === 'password' ? 'Sign In' : 'Send OTP'
                    )}
                  </button>


                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && loginMethod === 'otp' && (
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
                      'Verify & Login'
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
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to={'/signup'}>
                <button className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                  Sign Up
                </button>
              </Link>

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