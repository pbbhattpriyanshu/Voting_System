import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { authAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ adharNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.adharNumber || !form.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        adharNumber: Number(form.adharNumber),
        password: form.password,
      });
      login(res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-badge">🗳️ VoteAdhikar</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in with your Aadhaar number to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="adharNumber">Aadhaar Number</label>
              <input
                id="adharNumber"
                name="adharNumber"
                type="number"
                className="form-input"
                placeholder="Enter your 12-digit Aadhaar number"
                value={form.adharNumber}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? <span className="spinner" /> : 'Log in'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
