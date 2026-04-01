import { useState, useEffect } from 'react';
import { HiOutlineCheck, HiOutlineExclamation } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { votingAPI } from '../../api/api';
import toast from 'react-hot-toast';
import '../../styles/voting.css';

const Voting = () => {
  const { user, isAdmin, fetchProfile } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(user?.isVoted || false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await votingAPI.getCandidates();
      setCandidates(res.data.candidates);
    } catch {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = (id) => {
    if (hasVoted || isAdmin) return;
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmVote = async () => {
    setVoting(true);
    try {
      await votingAPI.vote(selectedId);
      toast.success('Your vote has been recorded!');
      setHasVoted(true);
      setShowConfirm(false);
      setSelectedId(null);
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Voting failed');
    } finally {
      setVoting(false);
    }
  };

  const getSelectedCandidate = () => candidates.find((c) => c._id === selectedId);

  const partyColors = ['#6366f1', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#eab308', '#ec4899', '#14b8a6'];

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="voting-page container">
        {/* Header */}
        <div className="voting-header">
          <h1 className="section-title">Cast Your Vote</h1>
          <p className="section-subtitle">
            Select your preferred candidate and confirm your vote. This action cannot be undone.
          </p>

          <div className="voting-info-bar">
            <div className="voting-info-item">
              <span className="dot green" />
              Election Active
            </div>
            <div className="voting-info-item">
              <span className="dot blue" />
              {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Admin / Already Voted Banner */}
        {isAdmin && (
          <div className="already-voted-banner" style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.2)' }}>
            <div className="voted-icon" style={{ background: 'rgba(249,115,22,0.15)', color: '#fb923c' }}>
              <HiOutlineExclamation />
            </div>
            <div className="voted-message">
              <h4 style={{ color: '#fb923c' }}>Admin Account</h4>
              <p>Admins cannot vote. You can manage candidates from the dashboard.</p>
            </div>
          </div>
        )}

        {hasVoted && !isAdmin && (
          <div className="already-voted-banner">
            <div className="voted-icon"><HiOutlineCheck /></div>
            <div className="voted-message">
              <h4>Vote Recorded!</h4>
              <p>Thank you for participating. You can view results on the Results page.</p>
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        <div className="candidates-grid stagger">
          {candidates.map((c, i) => (
            <div
              key={c._id}
              className={`candidate-card ${selectedId === c._id ? 'selected' : ''}`}
              id={`candidate-${c._id}`}
            >
              <div className="candidate-avatar-section">
                <div
                  className="candidate-avatar"
                  style={{ background: `linear-gradient(135deg, ${partyColors[i % partyColors.length]}33, ${partyColors[i % partyColors.length]}22)`, color: partyColors[i % partyColors.length] }}
                >
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div className="candidate-info">
                  <h3>{c.name}</h3>
                  <div className="candidate-party">
                    <span className="candidate-party-dot" style={{ background: partyColors[i % partyColors.length] }} />
                    {c.party}
                  </div>
                </div>
              </div>

              {!hasVoted && !isAdmin ? (
                <button
                  className="btn btn-primary btn-sm vote-btn"
                  onClick={() => handleSelectCandidate(c._id)}
                  id={`vote-btn-${c._id}`}
                >
                  Vote for {c.name}
                </button>
              ) : (
                <div className="vote-btn voted" style={{ textAlign: 'center' }}>
                  {isAdmin ? 'Admin View' : 'Vote Recorded ✓'}
                </div>
              )}
            </div>
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <div className="empty-state-title">No candidates registered</div>
            <div className="empty-state-text">Candidates will appear here once an admin registers them.</div>
          </div>
        )}

        {/* Confirm Dialog */}
        {showConfirm && (
          <div className="vote-confirm-overlay" onClick={() => { setShowConfirm(false); setSelectedId(null); }}>
            <div className="vote-confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">🗳️</div>
              <h3 className="confirm-title">Confirm Your Vote</h3>
              <p className="confirm-text">
                You are about to vote for the following candidate. This action is <strong>irreversible</strong>.
              </p>

              {getSelectedCandidate() && (
                <div className="confirm-candidate">
                  <div className="confirm-candidate-name">{getSelectedCandidate().name}</div>
                  <div className="confirm-candidate-party">{getSelectedCandidate().party}</div>
                </div>
              )}

              <div className="confirm-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => { setShowConfirm(false); setSelectedId(null); }}
                  id="vote-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleConfirmVote}
                  disabled={voting}
                  id="vote-confirm-btn"
                >
                  {voting ? <span className="spinner" /> : <>Confirm Vote <HiOutlineCheck /></>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;
