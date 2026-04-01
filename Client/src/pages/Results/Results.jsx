import { useState, useEffect } from 'react';
import { HiOutlineRefresh } from 'react-icons/hi';
import { votingAPI } from '../../api/api';
import toast from 'react-hot-toast';
import '../../styles/results.css';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await votingAPI.getVoteCount();
      setCandidates(res.data.candidates);
    } catch {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const maxVotes = candidates.length > 0 ? Math.max(...candidates.map((c) => c.voteCount)) : 0;

  const getRankClass = (i) => {
    if (i === 0) return 'gold';
    if (i === 1) return 'silver';
    if (i === 2) return 'bronze';
    return 'default';
  };

  const getBarClass = (i) => {
    if (i === 0) return 'first';
    if (i === 1) return 'second';
    if (i === 2) return 'third';
    return 'other';
  };

  const getPercentage = (count) => {
    if (totalVotes === 0) return 0;
    return ((count / totalVotes) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="results-page container">
        {/* Header */}
        <div className="results-header">
          <div className="results-header-row">
            <div>
              <h1 className="section-title">Election Results</h1>
              <p className="section-subtitle">Live vote count and candidate leaderboard</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="live-badge">
                <span className="live-dot" />
                Live
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => fetchResults(true)}
                disabled={refreshing}
                id="refresh-results-btn"
              >
                <HiOutlineRefresh className={refreshing ? 'spin-icon' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="results-summary">
          <div className="result-summary-card" style={{ animationDelay: '0.05s' }}>
            <div className="result-summary-value">{candidates.length}</div>
            <div className="result-summary-label">Total Candidates</div>
          </div>
          <div className="result-summary-card" style={{ animationDelay: '0.1s' }}>
            <div className="result-summary-value">{totalVotes}</div>
            <div className="result-summary-label">Total Votes Cast</div>
          </div>
          <div className="result-summary-card" style={{ animationDelay: '0.15s' }}>
            <div className="result-summary-value" style={{ color: '#fbbf24' }}>
              {candidates.length > 0 ? candidates[0].name : '—'}
            </div>
            <div className="result-summary-label">🏆 Current Leader</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <div className="leaderboard-title">Leaderboard</div>
            <span className="badge badge-blue">{candidates.length} candidates</span>
          </div>

          {candidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No results yet</div>
              <div className="empty-state-text">Results will appear once candidates are registered and votes are cast.</div>
            </div>
          ) : (
            <div className="leaderboard-list stagger">
              {candidates.map((c, i) => (
                <div className="leaderboard-item" key={c._id}>
                  {/* Rank */}
                  <div className={`leaderboard-rank ${getRankClass(i)}`}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">
                      {c.name}
                      {i === 0 && c.voteCount > 0 && (
                        <span className="winner-badge">
                          🏆 Leading
                        </span>
                      )}
                    </div>
                    <div className="leaderboard-party">{c.party}</div>
                  </div>

                  {/* Bar */}
                  <div className="leaderboard-bar-section">
                    <div className="vote-bar-track">
                      <div
                        className={`vote-bar-fill ${getBarClass(i)}`}
                        style={{
                          width: maxVotes > 0 ? `${(c.voteCount / maxVotes) * 100}%` : '0%',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 38, textAlign: 'right' }}>
                      {getPercentage(c.voteCount)}%
                    </span>
                  </div>

                  {/* Votes */}
                  <div className="leaderboard-votes">
                    <div className="leaderboard-vote-count">{c.voteCount}</div>
                    <div className="leaderboard-vote-label">votes</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
