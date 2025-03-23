
import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordLink: React.FC = () => {
  return (
    <div className="text-right mb-4">
      <Link 
        to="/forgot-password" 
        className="text-sm text-primary hover:underline"
      >
        Esqueceu sua senha?
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;
