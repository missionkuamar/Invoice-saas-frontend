// frontend/src/components/auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaLock, FaSpinner, FaGift, 
  FaGoogle, FaGithub, FaFacebook, FaArrowLeft, FaPalette 
} from 'react-icons/fa';
import { register } from '../../store/slices/authSlice';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';
import ThemeSwitcher from '../homepage/ThemeSwitcher';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { loading } = useSelector((state) => state.auth);
  
  const getRefFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || '';
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ref: getRefFromUrl(),
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const ref = getRefFromUrl();
    setFormData(prev => ({ ...prev, ref }));
    if (ref) {
      toast.success(`🎉 Referred by affiliate! Code: ${ref}`);
    }
  }, []);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    const password = formData.password;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const getPasswordStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[Math.min(passwordStrength - 1, 4)] || 'bg-gray-300';
  };

  const getPasswordStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    return texts[Math.min(passwordStrength - 1, 4)] || '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSocialRegister = (provider) => {
    toast.success(`Redirecting to ${provider}...`);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const finalRef = getRefFromUrl();
    const refToSend = formData.ref || finalRef;

    // Validation
    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    if (!formData.acceptTerms) {
      throw new Error("Please accept the Terms and Conditions");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      ref: refToSend,
    };

    const result = await dispatch(register(payload)).unwrap();

    toast.success(
      result?.affiliateReferral
        ? "🎉 Welcome! Referred by affiliate!"
        : "🎉 Account created successfully!"
    );

    navigate("/dashboard");
  } catch (error) {
    console.error("Registration Error:", error);

    const errorMessage =
      error?.response?.data?.message || // Axios Backend Error
      error?.data?.message ||           // RTK Query
      error?.message ||                 // JS Error
      error ||                          // rejectWithValue String
      "Registration failed. Please try again.";

    toast.error(errorMessage);
  }
};

  const refParam = getRefFromUrl();

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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-3xl font-bold mb-4 shadow-lg">
              IP
            </div>
            <h1 className={`text-3xl font-bold ${theme.colors.text}`}>
              Invoice<span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>Pro</span>
            </h1>
            <p className={`${theme.colors.text} opacity-70 mt-2`}>
              Create your free account
            </p>
            {refParam && (
              <div className={`mt-3 p-3 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FaGift className="text-purple-500" />
                  <span className={`${theme.colors.text} opacity-80`}>
                    Referred by affiliate! Code: <span className="font-bold text-purple-500">{refParam}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Register Buttons */}
          {/* <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialRegister('Google')}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all hover:scale-[1.02]`}
            >
              <FaGoogle className="text-red-500 text-xl" />
              <span className="font-medium">Continue with Google</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialRegister('Facebook')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                <FaFacebook className="text-blue-600 text-xl" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialRegister('GitHub')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                <FaGithub className="text-gray-700 text-xl" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </div> */}

          {/* Divider */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme.colors.border}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme.colors.card} ${theme.colors.text} opacity-60`}>
                Or register with email
              </span>
            </div>
          </div> */}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Full Name
              </label>
              <div className="relative">
                <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Password
              </label>
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
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40 hover:opacity-100`}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>
                    Strength: <span className="font-medium">{getPasswordStrengthText()}</span>
                    {passwordStrength < 3 && ' (Use 10+ chars with uppercase, numbers, special chars)'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40 hover:opacity-100`}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                required
              />
              <label className={`text-sm ${theme.colors.text} opacity-70`}>
                I agree to the{' '}
                <Link to="/terms" className={`${theme.colors.primary} hover:underline`}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className={`${theme.colors.primary} hover:underline`}>
                  Privacy Policy
                </Link>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${theme.colors.text} opacity-70`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-medium ${theme.colors.primary} hover:underline`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;