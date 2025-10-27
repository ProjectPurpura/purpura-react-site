// src/pages/AreaRestrita/AreaRestrita.tsx
import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './AreaRestrita.css';

const AreaRestrita: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      default:
        return 'Erro ao autenticar. Tente novamente.';
    }
  };

  return (
    <div className="area-restrita-container">
      <header className="area-restrita-header">
        <img
          src="/logo.svg"
          alt="PurPura Logo"
          className="area-restrita-logo"
        />
        <h1 className="area-restrita-title">PurPura BI Dashboard</h1>
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        )}
      </header>
      <main className="area-restrita-main">
        {!user ? (
          <div className="auth-container">
            <h2 className="auth-title">Entrar</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email-input" className="form-label">Email</label>
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password-input" className="form-label">Senha</label>
                <input
                  type="password"
                  id="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="form-input"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              {authError && (
                <div className="error-message">{authError}</div>
              )}

              <button 
                type="submit" 
                className="auth-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Entrar'}
              </button>
            </form>
          </div>
        ) : (
          <iframe
            src="https://app.powerbi.com/view?r=eyJrIjoiYjIxY2ZmZDEtN2Y3ZS00YzFjLWE3NGYtMGQ1MmZhNTUyMDUzIiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9"
            title="Dashboard BI PurPura"
            className="area-restrita-iframe"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </main>
    </div>
  );
};

export default AreaRestrita;
