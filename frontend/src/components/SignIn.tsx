import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      // Redirect based on user type
      if (user.isAdmin) {
        navigate('/admin'); // Redirect admin users to admin panel
      } else {
        navigate('/user'); // Redirect regular users to user page
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto bg-zinc-900 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gold-500 mb-8 text-center">Sign In now</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gold-500 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gold-500 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-gold-400 hover:text-gold-300 text-sm">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-500 text-black py-3 rounded-lg font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-gold-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold-500 hover:text-gold-300">
              Sign Up
            </Link>
          </div>
        </form>

        <div className="mt-4 p-4 bg-zinc-800 rounded text-sm">
          <p className="text-gold-400 mb-2">Test Credentials:</p>
          <p className="text-gold-400">User: user@example.com / user123</p>
          <p className="text-gold-400">Admin: admin@car-grip.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 