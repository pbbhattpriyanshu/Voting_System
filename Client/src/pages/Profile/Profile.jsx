import { useState } from 'react';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineIdentification, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/api';
import toast from 'react-hot-toast';
import '../../styles/profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword(passwordForm);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="profile-page container">
        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {getInitials(user?.name)}
          </div>
          <div className="profile-name">{user?.name}</div>
          <span
            className={`profile-role-badge ${user?.role === 'admin' ? 'badge-orange' : 'badge-blue'}`}
          >
            {user?.role === 'admin' ? '🛡️' : '🗳️'} {user?.role}
          </span>
        </div>

        {/* Personal Info */}
        <div className="profile-section">
          <div className="profile-section-header">
            <HiOutlineUser className="icon" />
            Personal Information
          </div>
          <div className="profile-info-list">
            <div className="profile-info-row">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{user?.name || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Age</span>
              <span className="profile-info-value">{user?.age || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>{user?.role || '—'}</span>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="profile-section">
          <div className="profile-section-header">
            <HiOutlineIdentification className="icon" />
            Identification
          </div>
          <div className="profile-info-list">
            <div className="profile-info-row">
              <span className="profile-info-label">Aadhaar Number</span>
              <span className="profile-info-value" style={{ fontFamily: 'monospace' }}>
                {user?.adharNumber
                  ? user.adharNumber.toString().replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                  : '—'}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Voting Status</span>
              <span className="profile-info-value">
                <span className={`badge ${user?.isVoted ? 'badge-green' : 'badge-orange'}`}>
                  {user?.isVoted ? '✓ Voted' : 'Not Yet Voted'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="profile-section">
          <div className="profile-section-header" style={{ cursor: 'pointer' }} onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <HiOutlineLockClosed className="icon" />
            Security — Change Password
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {showPasswordForm ? '▲ Collapse' : '▼ Expand'}
            </span>
          </div>

          {showPasswordForm && (
            <form className="password-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPwd">Current Password</label>
                <div className="input-password-wrapper">
                  <input
                    id="currentPwd"
                    type={showCurrent ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowCurrent(!showCurrent)} tabIndex={-1}>
                    {showCurrent ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="newPwd">New Password</label>
                <div className="input-password-wrapper">
                  <input
                    id="newPwd"
                    type={showNew ? 'text' : 'password'}
                    className="form-input"
                    placeholder="At least 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowNew(!showNew)} tabIndex={-1}>
                    {showNew ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} id="change-pwd-btn">
                {loading ? <span className="spinner" /> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
