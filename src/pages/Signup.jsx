import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  getPasswordStrength
} from '../utils/validators';

import { Shield, Eye, EyeOff } from 'lucide-react';

const Signup = () => {

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'employee'
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const validate = () => {

    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (confirmError) {
      newErrors.confirmPassword = confirmError;
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {

      await signup({
        name: formData.name,
        employeeId: formData.employeeId,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        department: formData.department || 'General',
        role: formData.role
      });

      console.log('User Saved Successfully');

      navigate('/dashboard', { replace: true });

    } catch (err) {

      console.log('Signup Error:', err);

      setSubmitError(
        err.message || 'Failed to create account'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    'Engineering',
    'Marketing',
    'IT',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'General'
  ];

  return (
    <div className="auth-layout">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            <Shield size={28} />
          </div>

          <h1 className="auth-title">
            Create account
          </h1>

          <p className="auth-subtitle">
            Join the employee portal
          </p>

        </div>

        {submitError && (
          <div className="alert alert-error">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label className="form-label" htmlFor="name">
              Full name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />

            {errors.name && (
              <div className="form-error">
                {errors.name}
              </div>
            )}

          </div>

          <div className="form-group">

            <label className="form-label" htmlFor="employeeId">
              Employee ID
            </label>

            <input
              type="text"
              id="employeeId"
              name="employeeId"
              className={`form-input ${errors.employeeId ? 'error' : ''}`}
              placeholder="EMP001"
              value={formData.employeeId}
              onChange={handleChange}
              autoComplete="off"
            />

            {errors.employeeId && (
              <div className="form-error">
                {errors.employeeId}
              </div>
            )}

          </div>

          <div className="form-group">

            <label className="form-label" htmlFor="email">
              Work email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
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

            <label className="form-label" htmlFor="department">
              Department
            </label>

            <select
              id="department"
              name="department"
              className="form-input"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">
                Select department
              </option>

              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label className="form-label" htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="employee">
                Employee
              </option>
            </select>

          </div>

          <div className="form-group">

            <label className="form-label" htmlFor="password">
              Password
            </label>

            <div style={{ position: 'relative' }}>

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {formData.password && (
              <div className="password-strength">

                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength.level}`} />
                </div>

                <span className={`strength-text ${passwordStrength.level}`}>
                  {passwordStrength.level}
                </span>

              </div>
            )}

            {errors.password && (
              <div className="form-error">
                {errors.password}
              </div>
            )}

          </div>

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            {errors.confirmPassword && (
              <div className="form-error">
                {errors.confirmPassword}
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}

          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Signup;