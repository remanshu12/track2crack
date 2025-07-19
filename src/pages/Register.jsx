import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaLinkedin,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

// Password strength logic
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Medium';
    case 3:
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return '';
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('FULL ERROR:', err);
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = {
    Weak: 'bg-red-400',
    Medium: 'bg-yellow-400',
    Strong: 'bg-green-500',
    'Very Strong': 'bg-blue-600'
  }[strengthLabel] || 'bg-gray-300';

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    passwordsMatch &&
    strength >= 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Bhaskar Sharma"
                autoComplete="off"
                className="w-full px-2 py-2 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="bhaskar@gmail.com"
                autoComplete="off"
                className="w-full px-2 py-2 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Enter password"
                className="w-full py-2 outline-none"
              />
            </div>

            {/* Password Strength */}
            {formData.password && (
              <>
                <div className="w-full h-2 mt-2 rounded bg-gray-200">
                  <div
                    className={`h-2 rounded ${strengthColor}`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">Level: {strengthLabel}</div>
              </>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Confirm password"
                className="w-full py-2 outline-none"
              />
            </div>

            {formData.confirmPassword.length > 0 && (
              <p
                className={`text-sm mt-1 ${
                  passwordsMatch ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 rounded-md font-semibold transition ${
              isFormValid
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-2">Or sign up with:</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white p-2 rounded-full hover:opacity-80 transition">
              <FaGoogle />
            </button>
            <button className="bg-pink-500 text-white p-2 rounded-full hover:opacity-80 transition">
              <FaGithub />
            </button>
            <button className="bg-blue-400 text-white p-2 rounded-full hover:opacity-80 transition">
              <FaLinkedin />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;