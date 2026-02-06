import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function PlatformGateway() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    instituteId: '',
    fullName: '',
    institutionName: '',
    institutionType: 'college',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validation
      if (!signupData.instituteId || !signupData.fullName || !signupData.institutionName) {
        throw new Error('Please fill in all required fields');
      }

      if (!signupData.email || !signupData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (signupData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (signupData.password !== signupData.passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      // Create Supabase user
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            institution_name: signupData.institutionName,
            institute_id: signupData.instituteId,
            institution_type: signupData.institutionType,
            phone: signupData.phone,
          }
        }
      });

      if (signupError) {
        throw new Error(signupError.message || 'Signup failed');
      }

      setSuccessMessage('Account created! Check your email to verify your account.');
      
      // Reset form
      setSignupData({
        instituteId: '',
        fullName: '',
        institutionName: '',
        institutionType: 'college',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
      });

      // Switch back to login after 2 seconds
      setTimeout(() => {
        setIsSignUp(false);
        setSuccessMessage('');
      }, 2000);

    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
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

        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            color: '#3c3',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)',
          borderBottom: `2px solid var(--nexora-border)`,
        }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setSuccessMessage('');
            }}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: 'none',
              border: 'none',
              borderBottom: isSignUp ? 'none' : `3px solid var(--nexora-primary-blue)`,
              color: isSignUp ? 'var(--nexora-text-muted)' : 'var(--nexora-primary-blue)',
              fontSize: '1rem',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setSuccessMessage('');
            }}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: 'none',
              border: 'none',
              borderBottom: !isSignUp ? 'none' : `3px solid var(--nexora-primary-blue)`,
              color: !isSignUp ? 'var(--nexora-text-muted)' : 'var(--nexora-primary-blue)',
              fontSize: '1rem',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {!isSignUp && (
          <div className="card" style={{
            padding: 'var(--spacing-lg)',
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

            <form onSubmit={handleLoginSubmit}>
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
                  value={loginData.email}
                  onChange={handleLoginChange}
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
                  value={loginData.password}
                  onChange={handleLoginChange}
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
        )}

        {/* Create Account Form */}
        {isSignUp && (
          <div className="card" style={{
            padding: 'var(--spacing-lg)',
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--nexora-primary-blue)',
              fontSize: '1.3rem',
            }}>
              Create Account
            </h2>
            
            <p style={{
              color: 'var(--nexora-text-secondary)',
              fontSize: '0.9rem',
              marginBottom: 'var(--spacing-lg)',
              margin: '0 0 var(--spacing-lg) 0',
            }}>
              Register your institution with Nexora
            </p>

            <form onSubmit={handleSignupSubmit}>
              {/* Institute ID */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Institute ID *
                </label>
                <input
                  type="text"
                  name="instituteId"
                  placeholder="INST-001"
                  value={signupData.instituteId}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Institution Name */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Institution Name *
                </label>
                <input
                  type="text"
                  name="institutionName"
                  placeholder="Solapur Institute of Technology"
                  value={signupData.institutionName}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Institution Type */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Institution Type
                </label>
                <select
                  name="institutionType"
                  value={signupData.institutionType}
                  onChange={handleSignupChange}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="school">School</option>
                  <option value="institute">Institute</option>
                </select>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@institution.edu"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter a secure password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--nexora-text-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '0.9rem',
                }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirm your password"
                  value={signupData.passwordConfirm}
                  onChange={handleSignupChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: `1px solid var(--nexora-border)`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--nexora-surface)',
                    color: 'var(--nexora-text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Button */}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-md)',
          marginTop: 'var(--spacing-lg)',
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
