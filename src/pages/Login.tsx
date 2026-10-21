import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('clashCode_token', data.token);
        navigate('/problems'); // Redirect to problem list
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('clashCode_token', data.token);
        navigate('/problems'); // Redirect to problem list
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