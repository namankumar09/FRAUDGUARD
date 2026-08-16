import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContainmentProvider } from './context/ContainmentContext';
import { TransactionActionProvider } from './context/TransactionActionContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ContainmentProvider>
          <TransactionActionProvider>
            <App />
          </TransactionActionProvider>
        </ContainmentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
