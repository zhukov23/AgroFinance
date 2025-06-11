import React from 'react';

interface AuthProtectedProps {
  children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  // Пока без авторизации, просто рендерим детей
  return <>{children}</>;
};

export default AuthProtected;