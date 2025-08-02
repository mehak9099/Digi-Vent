import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuthProvider } from '../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // We need to wrap this to provide navigate context
  return (
    <AuthProviderInner>
      {children}
    </AuthProviderInner>
  );
};

const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;