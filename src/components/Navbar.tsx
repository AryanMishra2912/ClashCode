import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#1a1a2e',
        borderBottom: '1px solid #2d2d44',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <span
        style={{ color: '#7c83fd', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        ClashCode
      </span>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate('/problems')}
              style={{
                background: 'transparent',
                border: '1px solid #7c83fd',
                color: '#7c83fd',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Problems
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: '#e53e3e',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '1px solid #7c83fd',
                color: '#7c83fd',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: '#7c83fd',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
