const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    gap: '1.25rem',
  }}>
    <div style={{
      width: 44,
      height: 44,
      border: '3px solid rgba(255,255,255,0.08)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      fontWeight: 500,
    }}>Loading...</p>
  </div>
);

export default LoadingScreen;
