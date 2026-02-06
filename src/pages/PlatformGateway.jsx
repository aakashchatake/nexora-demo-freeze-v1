import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function PlatformGateway() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        throw new Error(loginError.message || 'Login failed');
      }

      // Store user metadata in localStorage
      const user = data.user;
      const meta = user?.user_metadata || {};
      localStorage.setItem('nexora_institution_name', meta.institution_name || 'NEXORA');
      localStorage.setItem('nexora_full_name', meta.full_name || '');
      localStorage.setItem('nexora_email', user.email || '');
      localStorage.setItem('nexora_institute_id', meta.institute_id || '');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--nexora-bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-lg)',
    }}>
      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-xl)',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--nexora-primary-blue)',
            marginBottom: 'var(--spacing-sm)',
          }}>
            NEXORA
          </div>
          <p style={{
            color: 'var(--nexora-text-muted)',
            fontSize: '0.9rem',
            margin: 0,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 'var(--font-weight-semibold)',
          }}>
            Institutional Access Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            color: '#c33',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Card */}
        <div className="card" style={{
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <h2 style={{
            marginTop: 0,
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--nexora-primary-blue)',
            fontSize: '1.5rem',
          }}>
            Sign in to your Nexora Platform
          </h2>
          
          <p style={{
            color: 'var(--nexora-text-secondary)',
            fontSize: '0.95rem',
            marginBottom: 'var(--spacing-lg)',
            margin: '0 0 var(--spacing-lg) 0',
          }}>
            For universities, colleges, and institutions
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--nexora-text-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: '0.9rem',
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@institution.edu"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid var(--nexora-border)`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'var(--nexora-surface)',
                  color: 'var(--nexora-text-primary)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--nexora-primary-blue)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--nexora-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--nexora-text-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: '0.9rem',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid var(--nexora-border)`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'var(--nexora-surface)',
                  color: 'var(--nexora-text-primary)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--nexora-primary-blue)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--nexora-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <p style={{
            color: 'var(--nexora-text-secondary)',
            fontSize: '0.9rem',
            margin: 0,
            marginBottom: 'var(--spacing-sm)'
          }}>
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--nexora-primary-blue)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-semibold)',
              fontFamily: 'inherit',
              padding: 0,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Create Institution Account
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-md)',
          borderTop: `1px solid var(--nexora-border)`,
        }}>
          <p style={{
            color: 'var(--nexora-text-muted)',
            fontSize: '0.85rem',
            margin: 0,
            marginBottom: 'var(--spacing-xs)',
          }}>
            Powered by Nexora
          </p>
          <p style={{
            color: 'var(--nexora-text-muted)',
            fontSize: '0.85rem',
            margin: 0,
          }}>
            Secure institutional platform
          </p>
        </div>
      </div>
    </div>
  );
}
