import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLocalError(null);
    
    if (password !== password2) {
      setLocalError('Passwords do not match');
      return;
    }
    
    const success = await register({
      name,
      email,
      password
    });
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">
            <i className="fas fa-user-plus"></i> Register
          </h1>
          <p className="lead text-center">Create your account</p>
          {localError && (
            <div className="alert alert-danger">{localError}</div>
          )}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="form-control"
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                className="form-control"
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>
          </form>
          <p className="my-1 text-center">
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;