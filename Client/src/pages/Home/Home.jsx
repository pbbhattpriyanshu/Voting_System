import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineLightningBolt, HiOutlineGlobe, HiOutlineArrowRight } from 'react-icons/hi';
import '../../styles/home.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🔐',
      title: 'Aadhaar Verified',
      desc: 'Every vote is linked to a verified Aadhaar number, preventing duplicate voting and ensuring identity.',
      color: 'rgba(99,102,241,0.15)',
    },
    {
      icon: '🛡️',
      title: 'Tamper-Proof',
      desc: 'Votes are recorded securely in the database with user-level tracking. One person, one vote guarantee.',
      color: 'rgba(34,197,94,0.15)',
    },
    {
      icon: '📊',
      title: 'Live Results',
      desc: 'Track vote counts in real-time with a dynamic leaderboard. Transparent and open results for everyone.',
      color: 'rgba(59,130,246,0.15)',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      desc: 'Admins manage candidates while voters cast their ballots. Clean separation of responsibilities.',
      color: 'rgba(249,115,22,0.15)',
    },
    {
      icon: '⚡',
      title: 'Fast & Reliable',
      desc: 'Built with modern web technologies for a seamless, responsive experience on any device.',
      color: 'rgba(236,72,153,0.15)',
    },
    {
      icon: '🌍',
      title: 'Accessible Anywhere',
      desc: 'Vote from anywhere with an internet connection. No need to travel to a polling station.',
      color: 'rgba(168,85,247,0.15)',
    },
  ];

  return (
    <div className="home-page page-wrapper">
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-glow-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Secure Digital Voting Platform
          </div>

          <h1 className="hero-title">
            Your Voice,{' '}
            <span className="hero-title-gradient">Your Vote,</span>
            <br />
            Your Democracy
          </h1>

          <p className="hero-description">
            VoteAdhikar empowers every citizen with a secure, transparent, and
            accessible digital voting experience. Cast your vote with confidence,
            backed by Aadhaar verification.
          </p>

          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-dashboard-btn">
                  Go to Dashboard
                  <HiOutlineArrowRight />
                </Link>
                <Link to="/results" className="btn btn-outline btn-lg" id="hero-results-btn">
                  View Results
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                  Register to Vote
                  <HiOutlineArrowRight />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" id="hero-login-btn">
                  Already registered? Log in
                </Link>
              </>
            )}
          </div>

          <div className="hero-stat-row">
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">Secure & Encrypted</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">1:1</div>
              <div className="hero-stat-label">One Person One Vote</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">24/7</div>
              <div className="hero-stat-label">Platform Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Why VoteAdhikar?</h2>
            <p className="section-subtitle">
              Built with security and transparency at its core
            </p>
          </div>

          <div className="features-grid stagger">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div
                  className="feature-icon-wrap"
                  style={{ background: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Cast Your Vote?</h2>
            <p className="cta-text">
              Join thousands of citizens exercising their democratic right through our secure platform.
            </p>
            <div className="cta-actions">
              {user ? (
                <Link to="/vote" className="btn btn-primary btn-lg" id="cta-vote-btn">
                  Cast Your Vote Now
                  <HiOutlineArrowRight />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
                    Create Account
                    <HiOutlineArrowRight />
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg" id="cta-login-btn">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        textAlign: 'center',
        borderTop: '1px solid var(--border-default)',
        color: 'var(--text-muted)',
        fontSize: '0.8125rem',
      }}>
        <div className="container">
          © {new Date().getFullYear()} VoteAdhikar. Secure Digital Voting Platform.
        </div>
      </footer>
    </div>
  );
};

export default Home;
