// frontend/src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaGoogle, FaGithub, FaFacebook, FaArrowLeft, FaPalette } from 'react-icons/fa';
import { login } from '../../store/slices/authSlice';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';
import ThemeSwitcher from '../homepage/ThemeSwitcher';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })).unwrap();
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`Redirecting to ${provider}...`);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative ${theme.colors.background}`}>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <button
          onClick={handleGoBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.colors.card} border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl ${theme.colors.card} border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all text-sm font-medium`}
          >
            Home
          </Link>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className={`${theme.colors.card} rounded-2xl shadow-2xl p-8 border ${theme.colors.border}`}>
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-3xl font-bold mb-4 shadow-lg">
              IP
            </div>
            <h1 className={`text-3xl font-bold ${theme.colors.text}`}>
              Invoice<span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>Pro</span>
            </h1>
            <p className={`${theme.colors.text} opacity-70 mt-2`}>
              Sign in to your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {/* <button
              onClick={() => handleSocialLogin('Google')}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all hover:scale-[1.02]`}
            >
              <FaGoogle className="text-red-500 text-xl" />
              <span className="font-medium">Continue with Google</span>
            </button> */}
            
            {/* <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                <FaFacebook className="text-blue-600 text-xl" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                <FaGithub className="text-gray-700 text-xl" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div> */}
          </div>

          {/* Divider */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme.colors.border}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme.colors.card} ${theme.colors.text} opacity-60`}>
                Or continue with email
              </span>
            </div>
          </div> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`block text-sm font-medium ${theme.colors.text}`}>
                  Password
                </label>
                <Link to="/forgot-password" className={`text-sm ${theme.colors.primary} hover:underline`}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40 hover:opacity-100`}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className={`text-sm ${theme.colors.text} opacity-70`}>
                  Remember me
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold ${theme.colors.button} transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${theme.colors.text} opacity-70`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-medium ${theme.colors.primary} hover:underline`}>
              Sign up
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className={`mt-4 p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
            <p className={`text-xs ${theme.colors.text} opacity-60 text-center`}>
              Demo: admin@invoicehub.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;