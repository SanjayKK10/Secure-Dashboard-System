import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validators';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState('');

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetEmail, setResetEmail] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const from =
    location.state?.from?.pathname || null;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {

      setErrors(prev => ({
        ...prev,
        [name]: null
      }));

    }

    if (submitError) setSubmitError('');
  };

  const validate = () => {

    const newErrors = {};

    const emailError =
      validateEmail(formData.email);

    if (emailError)
      newErrors.email = emailError;

    if (!formData.password)
      newErrors.password =
        'Password is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setSubmitError('');

    try {

      const user =
        await login(
          formData.email,
          formData.password
        );

      const defaultRoute =
        user.role === 'admin'
          ? '/admin'
          : '/dashboard';

      navigate(
        from || defaultRoute,
        { replace: true }
      );

    } catch (err) {

      setSubmitError(err.message);

    } finally {

      setIsSubmitting(false);

    }
  };

  // FIXED PASSWORD RESET FUNCTION
  const handlePasswordReset = async () => {

    if (!resetEmail || !newPassword) {

      alert('Please fill all fields');

      return;
    }

    // GET USERS FROM CORRECT STORAGE
    const users =
      JSON.parse(
        localStorage.getItem('portal_users')
      ) || [];

    // FIND USER
    const userIndex =
      users.findIndex(
        (u) =>
          u.email.toLowerCase() ===
          resetEmail.toLowerCase()
      );

    if (userIndex === -1) {

      alert('Email not found');

      return;
    }

    // HASH PASSWORD
    const encoder = new TextEncoder();

    const data = encoder.encode(
      newPassword + 'portal_salt_2024'
    );

    const hashBuffer =
      await crypto.subtle.digest(
        'SHA-256',
        data
      );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    const hashedPassword = hashArray
      .map((b) =>
        b.toString(16).padStart(2, '0')
      )
      .join('');

    // SAVE HASHED PASSWORD
    users[userIndex].password =
      hashedPassword;

    // SAVE BACK TO LOCAL STORAGE
    localStorage.setItem(
      'portal_users',
      JSON.stringify(users)
    );

    alert(
      'Password reset successful'
    );

    setShowForgotPassword(false);

    setResetEmail('');

    setNewPassword('');
  };

  return (

    <div className="auth-layout">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            <Shield size={28} />
          </div>

          <h1 className="auth-title">
            Welcome back
          </h1>

          <p className="auth-subtitle">
            Sign in to access your employee portal
          </p>

        </div>

        {submitError && (

          <div className="alert alert-error">
            {submitError}
          </div>

        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="email"
            >
              Email address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${
                errors.email ? 'error' : ''
              }`}
              placeholder="you@google.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {errors.email && (
              <div className="form-error">
                {errors.email}
              </div>
            )}

          </div>

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="password"
            >
              Password
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                id="password"
                name="password"
                className={`form-input ${
                  errors.password
                    ? 'error'
                    : ''
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{
                  paddingRight: '3rem'
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color:
                    'var(--text-secondary)',
                  padding: '0.25rem'
                }}
              >

                {showPassword
                  ? <EyeOff size={20} />
                  : <Eye size={20} />
                }

              </button>

            </div>

            {errors.password && (

              <div className="form-error">
                {errors.password}
              </div>

            )}

          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >

            {isSubmitting ? (

              <>
                <div className="loading-spinner" />
                Signing in...
              </>

            ) : (

              'Sign in'

            )}

          </button>

        </form>

        <div
          style={{
            marginTop: '1rem',
            textAlign: 'right'
          }}
        >

          <button
            type="button"
            onClick={() =>
              setShowForgotPassword(true)
            }
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Forgot Password?
          </button>

        </div>

        <div className="auth-footer">

          Don't have an account?
          {' '}
          <Link to="/signup">
            Create one
          </Link>

        </div>

        {showForgotPassword && (

          <div
            style={{
              position: 'fixed',
              inset: 0,
              background:
                'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >

            <div
              style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '400px'
              }}
            >

              <h2
                style={{
                  marginBottom: '1rem'
                }}
              >
                Reset Password
              </h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) =>
                  setResetEmail(
                    e.target.value
                  )
                }
                className="form-input"
                style={{
                  marginBottom: '1rem'
                }}
              />

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="form-input"
                style={{
                  marginBottom: '1rem'
                }}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '1rem'
                }}
              >

                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={
                    handlePasswordReset
                  }
                >
                  Reset Password
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() =>
                    setShowForgotPassword(
                      false
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
};

export default Login;