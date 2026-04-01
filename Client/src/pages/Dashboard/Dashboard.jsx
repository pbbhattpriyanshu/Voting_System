import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClipboardCheck, HiOutlineChartBar, HiOutlineUser, HiOutlineUserGroup, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { votingAPI, candidateAPI } from '../../api/api';
import toast from 'react-hot-toast';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Add Candidate Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', age: '', party: '', symbolPic: '' });
  const [addLoading, setAddLoading] = useState(false);

  // Edit Candidate Modal
  const [editCandidate, setEditCandidate] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', party: '', symbolPic: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await votingAPI.getVoteCount();
      setCandidates(res.data.candidates);
      const total = res.data.candidates.reduce((sum, c) => sum + c.voteCount, 0);
      setTotalVotes(total);
    } catch {
      // Silent fail for non-critical data
    } finally {
      setLoading(false);
    }
  };

  // Add Candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.age || !addForm.party || !addForm.symbolPic) {
      toast.error('All fields required');
      return;
    }
    setAddLoading(true);
    try {
      await candidateAPI.register({ ...addForm, age: Number(addForm.age) });
      toast.success('Candidate added!');
      setShowAddModal(false);
      setAddForm({ name: '', age: '', party: '', symbolPic: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit Candidate
  const openEditModal = (c) => {
    setEditCandidate(c);
    setEditForm({ name: c.name, age: c.age || '', party: c.party, symbolPic: c.symbolPic || '' });
  };

  const handleEditCandidate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await candidateAPI.update(editCandidate._id, { ...editForm, age: Number(editForm.age) });
      toast.success('Candidate updated!');
      setEditCandidate(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (id, name) => {
    if (!window.confirm(`Delete candidate "${name}"?`)) return;
    try {
      await candidateAPI.delete(id);
      toast.success('Candidate deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const partyColors = ['#6366f1', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#eab308', '#ec4899', '#14b8a6'];
  const getPartyColor = (i) => partyColors[i % partyColors.length];

  return (
    <div className="page-wrapper">
      <div className="dashboard-page container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">
            Welcome back, <span>{user?.name || 'User'}</span>
          </h1>
          <p className="dashboard-subtext">
            {isAdmin
              ? 'Manage candidates and monitor election activity from your admin dashboard.'
              : 'Cast your vote, track results, and manage your profile.'}
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card" style={{ animationDelay: '0.05s' }}>
            <div className="stat-card-header">
              <div className="stat-card-icon blue"><HiOutlineUserGroup /></div>
              <span className="badge badge-blue">Total</span>
            </div>
            <div className="stat-card-value">{loading ? '—' : candidates.length}</div>
            <div className="stat-card-label">Candidates</div>
          </div>

          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card-header">
              <div className="stat-card-icon green"><HiOutlineClipboardCheck /></div>
              <span className="badge badge-green">Live</span>
            </div>
            <div className="stat-card-value">{loading ? '—' : totalVotes}</div>
            <div className="stat-card-label">Total Votes Cast</div>
          </div>

          <div className="stat-card" style={{ animationDelay: '0.15s' }}>
            <div className="stat-card-header">
              <div className="stat-card-icon indigo"><HiOutlineChartBar /></div>
              <span className="badge badge-indigo">Leader</span>
            </div>
            <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
              {loading || candidates.length === 0 ? '—' : candidates[0]?.name}
            </div>
            <div className="stat-card-label">Leading Candidate</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="dashboard-section-title">⚡ Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/vote" className="action-card" id="action-vote">
            <div className="action-icon blue"><HiOutlineClipboardCheck /></div>
            <div className="action-content">
              <h4>Cast Vote</h4>
              <p>Vote for your preferred candidate</p>
            </div>
          </Link>
          <Link to="/results" className="action-card" id="action-results">
            <div className="action-icon green"><HiOutlineChartBar /></div>
            <div className="action-content">
              <h4>View Results</h4>
              <p>See the live leaderboard</p>
            </div>
          </Link>
          <Link to="/profile" className="action-card" id="action-profile">
            <div className="action-icon indigo"><HiOutlineUser /></div>
            <div className="action-content">
              <h4>My Profile</h4>
              <p>View or edit your details</p>
            </div>
          </Link>
        </div>

        {/* Admin: Candidates Table */}
        {isAdmin && (
          <>
            <h3 className="dashboard-section-title">🛡️ Manage Candidates</h3>
            <div className="candidates-table-card">
              <div className="table-header">
                <div className="table-title">All Candidates ({candidates.length})</div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddModal(true)}
                  id="add-candidate-btn"
                >
                  <HiOutlinePlus /> Add Candidate
                </button>
              </div>

              {candidates.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-title">No candidates yet</div>
                  <div className="empty-state-text">Add your first candidate to get started.</div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Party</th>
                        <th>Votes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((c, i) => (
                        <tr key={c._id}>
                          <td>{i + 1}</td>
                          <td><span className="table-name">{c.name}</span></td>
                          <td>
                            <span className="badge badge-indigo">{c.party}</span>
                          </td>
                          <td>{c.voteCount}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="table-action-btn"
                                title="Edit"
                                onClick={() => openEditModal(c)}
                              >
                                <HiOutlinePencil />
                              </button>
                              <button
                                className="table-action-btn danger"
                                title="Delete"
                                onClick={() => handleDeleteCandidate(c._id, c.name)}
                              >
                                <HiOutlineTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Candidate Modal */}
        {showAddModal && (
          <div className="vote-confirm-overlay" onClick={() => setShowAddModal(false)}>
            <div className="vote-confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
              <h3 className="confirm-title" style={{ textAlign: 'center' }}>Add New Candidate</h3>
              <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="Candidate name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" type="number" placeholder="Age" value={addForm.age} onChange={(e) => setAddForm({ ...addForm, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Party</label>
                  <input className="form-input" placeholder="Party name" value={addForm.party} onChange={(e) => setAddForm({ ...addForm, party: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Symbol (Emoji/URL)</label>
                  <input className="form-input" placeholder="🏛️ or image url" value={addForm.symbolPic} onChange={(e) => setAddForm({ ...addForm, symbolPic: e.target.value })} />
                </div>
                <div className="confirm-actions" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={addLoading}>
                    {addLoading ? <span className="spinner" /> : 'Add Candidate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Candidate Modal */}
        {editCandidate && (
          <div className="vote-confirm-overlay" onClick={() => setEditCandidate(null)}>
            <div className="vote-confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
              <h3 className="confirm-title" style={{ textAlign: 'center' }}>Edit Candidate</h3>
              <form onSubmit={handleEditCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Party</label>
                  <input className="form-input" value={editForm.party} onChange={(e) => setEditForm({ ...editForm, party: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Symbol</label>
                  <input className="form-input" value={editForm.symbolPic} onChange={(e) => setEditForm({ ...editForm, symbolPic: e.target.value })} />
                </div>
                <div className="confirm-actions" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setEditCandidate(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={editLoading}>
                    {editLoading ? <span className="spinner" /> : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
