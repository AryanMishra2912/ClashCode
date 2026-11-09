import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Send/receive httpOnly cookies
      });
      const data = await response.json();

      if (response.ok) {
        // Token is now stored in an httpOnly cookie by the server automatically
        login();
        navigate('/problems');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  // Inside your handleGoogleLogin function in frontend login.tsx
const handleGoogleLogin = async (credentialResponse: any) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
      credentials: 'include' // Crucial: Tells the browser to accept the Set-Cookie header
    });
    const data = await response.json();

    if (response.ok) {
      // The browser automatically stored the HttpOnly cookie.
      // We no longer use localStorage here.
      login();
      navigate('/problems');
    }
  } catch (err) {
    console.error('Google login failed', err);
  }
};

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login to clashCode</h2>
      
      <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Login</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>

      <hr style={{ margin: '20px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('Google Login Failed')} />
      </div>
    </div>
  );
}