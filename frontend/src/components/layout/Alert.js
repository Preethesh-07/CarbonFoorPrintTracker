import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Alert = () => {
  const { error, clearError } = useContext(AuthContext);

  if (!error) return null;

  return (
    <div className="alert alert-danger">
      <i className="fas fa-exclamation-circle"></i> {error}
      <button type="button" className="close" onClick={clearError}>
        <span>&times;</span>
      </button>
    </div>
  );
};

export default Alert;