// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Vite uses import.meta.env, NOT process.env
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Optional: Add a console.log here temporarily to ensure it's not printing "undefined"
console.log("My Client ID is:", clientId);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);