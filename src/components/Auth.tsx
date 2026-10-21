import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

// Define the prop type so TypeScript is happy
interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        onLogin(); // Trigger the state update in App.tsx
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
        onLogin(); // Trigger the state update in App.tsx
      }
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Welcome to clashCode</h2>
      
      <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>

      <hr style={{ margin: '20px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log('Google Login Failed')}
        />
      </div>
    </div>
  );
}