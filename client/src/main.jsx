import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './app/providers';
import AppRoutes from './app/routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/themes.css';
import './styles/globals.css';

// Using import.meta.env for Vite environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.warn(
    'VITE_GOOGLE_CLIENT_ID is not defined. Google OAuth will not be available. ' +
    'Add it to client/.env to enable Google Sign-In.'
  );
}

const AppTree = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        {clientId ? (
          <GoogleOAuthProvider clientId={clientId}>
            <AppRoutes />
          </GoogleOAuthProvider>
        ) : (
          <AppRoutes />
        )}
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<AppTree />);
