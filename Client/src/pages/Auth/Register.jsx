import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { authAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/auth.css';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    adharNumber: '',
    password: '',
    age: '',
    address: '',
    role: 'voter',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, adharNumber, password, email, address, age, phone } = form;
    if (!name || !adharNumber || !password || !email || !address || !age || !phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.signup({
        ...form,
        adharNumber: Number(form.adharNumber),
        age: Number(form.age),
      });
      login(res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container" style={{ maxWidth: 520 }}>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-badge">🗳️ VoteAdhikar</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Register with your details to get started</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-age">Age</label>
                <input
                  id="reg-age"
                  name="age"
                  type="number"
                  className="form-input"
                  placeholder="18"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-adhar">Aadhaar Number</label>
                <input
                  id="reg-adhar"
                  name="adharNumber"
                  type="number"
                  className="form-input"
                  placeholder="123456789012"
                  value={form.adharNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-address">Address</label>
              <input
                id="reg-address"
                name="address"
                type="text"
                className="form-input"
                placeholder="Your full address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-password-wrapper">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Minimum 8 characters"
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

            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">Register as</label>
              <div className="role-selector">
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    id="role-voter"
                    value="voter"
                    checked={form.role === 'voter'}
                    onChange={handleChange}
                  />
                  <label htmlFor="role-voter" className="role-label">
                    <span className="role-icon">🗳️</span>
                    <span className="role-name">Voter</span>
                  </label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    id="role-admin"
                    value="admin"
                    checked={form.role === 'admin'}
                    onChange={handleChange}
                  />
                  <label htmlFor="role-admin" className="role-label">
                    <span className="role-icon">🛡️</span>
                    <span className="role-name">Admin</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
