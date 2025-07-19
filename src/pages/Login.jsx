import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ Missing loading state
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      if (emailInput) emailInput.value = '';
      if (passInput) passInput.value = '';
      setFormData({ email: '', password: '' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Set loading true on submit
    try {
      const response = await API.post('/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      alert('Invalid credentials or server error');
    } finally {
      setLoading(false); // ✅ Reset loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">LogIn</h2>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaEnvelope className="text-gray-400" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
                className="w-full px-2 py-2 outline-none"
                placeholder="bhaskar@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400" />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full px-2 py-2 outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500'} 
              text-white py-2 rounded-md font-semibold hover:opacity-90 transition`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-gray-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-700">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-2">Or log in with:</p>
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

export default Login;