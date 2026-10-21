import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('clashCode_token', data.token);
        navigate('/problems');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Signup failed', err);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    // Same Google logic as Login.tsx
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('clashCode_token', data.token);
        navigate('/problems');
      }
    } catch (err) {
      console.error('Google signup failed', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Create a clashCode Account</h2>
      
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Sign Up</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>

      <hr style={{ margin: '20px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('Google Signup Failed')} />
      </div>
    </div>
  );
}