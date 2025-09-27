import React, { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Typewriter from '../components/ui/Typewriter';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // Navigation is handled inside the login function
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent_80%)]"></div>
      
      <div className="absolute top-6 left-6">
        <NavLink to="/" className="text-2xl">
          <Typewriter text="NORBS SERVICE" className="logo-3d-effect" />
        </NavLink>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="uiverse-card">
           <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
           <div className="uiverse-card-content relative z-10">
            <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Welcome Back</h1>
            <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-accent-foreground bg-accent hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
             <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">Owner: owner@norbs.nl / Client: client@example.com</p>
                 <p className="text-muted-foreground">(Password can be anything)</p>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
