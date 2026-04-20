'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const LOGIN_STEPS = ['Credentials', 'Signing In'];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setActiveStep(1);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setActiveStep(0);
        throw new Error(data.message || 'Login failed');
      }

      setAuth(data.user, data.company, data.token);
      setLoginSuccess(true);

      setTimeout(() => {
        if (data.user.role === 'super_admin' || data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F7F8FA' }}>
      {/* ─── Top Strip ─── */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '12px',
          px: '2rem',
          py: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.02em',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px' }}>
            Home
          </Link>
          <Link href="/register" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px' }}>
            Register
          </Link>
        </Box>
      </Box>

      {/* ─── Main Content ─── */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* ─── Left Panel — Navy with animated gradient ─── */}
        <Box
          sx={{
            width: '50%',
            bgcolor: '#0A1628',
            position: 'relative',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 7,
            overflow: 'hidden',
          }}
        >
          {/* Animated gradient orbs */}
          <Box sx={{
            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,146,42,0.12) 0%, transparent 70%)',
            top: '-15%', right: '-10%', pointerEvents: 'none',
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': { '0%, 100%': { transform: 'translate(0, 0)' }, '50%': { transform: 'translate(-20px, 20px)' } },
          }} />
          <Box sx={{
            position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,146,42,0.08) 0%, transparent 70%)',
            bottom: '-10%', left: '-5%', pointerEvents: 'none',
            animation: 'float2 10s ease-in-out infinite',
            '@keyframes float2': { '0%, 100%': { transform: 'translate(0, 0)' }, '50%': { transform: 'translate(15px, -15px)' } },
          }} />
          
          {/* Gold accent line */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #C8922A, #E8B64A, #C8922A)' }} />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                bgcolor: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.25)',
                color: '#E8B64A', px: '16px', py: '6px', borderRadius: '6px',
                fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
                fontWeight: 600, mb: 4,
              }}
            >
              <Box sx={{
                width: 7, height: 7, bgcolor: '#E8B64A', borderRadius: '50%',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(0.8)' } },
              }} />
              Recruiter Portal
            </Box>

            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '52px',
                fontWeight: 700,
                color: '#FEFEFE',
                lineHeight: 1.05,
                mb: 2.5,
                letterSpacing: '-0.03em',
              }}
            >
              Career<br />Development<br />
              <Box component="span" sx={{ color: '#E8B64A' }}>Centre</Box>
            </Typography>

            <Typography
              sx={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
                maxWidth: '400px',
                mb: 5,
              }}
            >
              Submit Job Notification Forms (JNF) and Intern Notification Forms (INF) for India&apos;s premier institute of technology.
            </Typography>

            {/* Stats — modern pill style */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { value: '500+', label: 'Companies' },
                { value: '1200+', label: 'Offers' },
                { value: '250+', label: 'Profiles' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    px: 2.5, py: 1.5,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: 90,
                  }}
                >
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '24px', fontWeight: 700, color: '#FEFEFE', lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', mt: '6px', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ─── Right Panel — Login Form with Stepper ─── */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F7F8FA',
            position: 'relative',
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Subtle grid pattern */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(10,22,40,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          <Box sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
            {/* Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: 5 }}>
              <Box
                component="img"
                src="/iit-ism-logo.svg"
                alt="IIT (ISM) Dhanbad"
                sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
              />
              <Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 700, color: '#0A1628', lineHeight: 1.2 }}>
                  IIT (ISM) Dhanbad
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Career Development Centre
                </Typography>
              </Box>
            </Box>

            {/* ─── Stepper ─── */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {LOGIN_STEPS.map((label, i) => {
                  const isActive = activeStep === i;
                  const isDone = i < activeStep || loginSuccess;
                  return (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', flex: i < LOGIN_STEPS.length - 1 ? 1 : 'none' }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        bgcolor: isDone ? '#C8922A' : isActive ? '#0A1628' : 'transparent',
                        color: isDone || isActive ? '#FFF' : '#94A3B8',
                        border: `2px solid ${isDone ? '#C8922A' : isActive ? '#0A1628' : '#E2E8F0'}`,
                        boxShadow: isActive ? '0 0 0 4px rgba(10,22,40,0.06)' : isDone ? '0 0 0 4px rgba(200,146,42,0.1)' : 'none',
                      }}>
                        {isDone ? '✓' : `0${i + 1}`}
                      </Box>
                      {i < LOGIN_STEPS.length - 1 && (
                        <Box sx={{
                          flex: 1, height: '2px', mx: 1.5,
                          bgcolor: isDone ? '#C8922A' : '#E2E8F0',
                          transition: 'background-color 0.5s',
                          borderRadius: 1,
                        }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', mt: 1 }}>
                {LOGIN_STEPS.map((label, i) => (
                  <Box key={label} sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontSize: '12px', fontWeight: activeStep === i ? 600 : 400,
                      color: activeStep === i ? '#0A1628' : '#94A3B8',
                      transition: 'all 0.3s',
                    }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ─── Form Card ─── */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(10,22,40,0.06)',
                boxShadow: '0 4px 24px rgba(10,22,40,0.06), 0 1px 3px rgba(10,22,40,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <Box sx={{
                px: 3.5, py: 2,
                borderBottom: '1px solid rgba(10,22,40,0.04)',
                bgcolor: 'rgba(247,248,250,0.5)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 700, color: '#0A1628' }}>
                  {activeStep === 0 ? 'Recruiter Login' : loginSuccess ? 'Welcome Back!' : 'Authenticating...'}
                </Typography>
                <Typography sx={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
                  color: '#64748B', bgcolor: '#F1F5F9', px: '10px', py: '4px', borderRadius: '6px', fontWeight: 500,
                }}>
                  Step {activeStep + 1} of {LOGIN_STEPS.length}
                </Typography>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3.5 }}>
                {/* Step 0: Credentials */}
                {activeStep === 0 && (
                  <>
                    <Typography sx={{ fontSize: '14px', color: '#64748B', mb: 3, lineHeight: 1.6 }}>
                      Sign in to access your recruitment dashboard and manage JNF/INF submissions.
                    </Typography>

                    {error && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3, borderRadius: '10px',
                          bgcolor: '#FEF2F2', color: '#DC2626',
                          border: '1px solid #FECACA',
                          '& .MuiAlert-icon': { color: '#DC2626' },
                        }}
                        onClose={() => setError('')}
                      >
                        {error}
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 600, mb: '8px' }}>
                          Email Address <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          type="email"
                          placeholder="recruiter@company.com"
                          value={formData.email}
                          onChange={handleChange('email')}
                          required
                          size="small"
                          id="login-email"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 600, mb: '8px' }}>
                          Password <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange('password')}
                          required
                          size="small"
                          id="login-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  sx={{ color: '#94A3B8' }}
                                >
                                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Box sx={{ textAlign: 'right', mb: 3 }}>
                        <Link href="/forgot-password" style={{ fontSize: '13px', color: '#C8922A', textDecoration: 'none', fontWeight: 600 }}>
                          Forgot Password?
                        </Link>
                      </Box>

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        id="login-submit"
                        sx={{
                          bgcolor: '#0A1628',
                          color: '#FEFEFE',
                          py: '13px',
                          fontSize: '15px',
                          fontWeight: 600,
                          borderRadius: '10px',
                          '&:hover': { bgcolor: '#1A2A44' },
                          '&:disabled': { opacity: 0.7 },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={22} sx={{ color: '#FEFEFE' }} />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Sign In
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Box>
                        )}
                      </Button>
                    </form>
                  </>
                )}

                {/* Step 1: Signing In / Success */}
                {activeStep === 1 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    {loginSuccess ? (
                      <>
                        <Box sx={{
                          width: 64, height: 64, borderRadius: '50%',
                          bgcolor: 'rgba(200,146,42,0.1)',
                          border: '2px solid rgba(200,146,42,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                          animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '@keyframes scaleIn': { '0%': { transform: 'scale(0.5)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
                        }}>
                          <Typography sx={{ fontSize: '28px', color: '#C8922A' }}>✓</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '20px', fontWeight: 700, color: '#0A1628', mb: 1 }}>
                          Authentication Successful
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
                          Redirecting to your dashboard...
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CircularProgress size={48} sx={{ color: '#C8922A', mb: 3 }} />
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 600, color: '#0A1628', mb: 1 }}>
                          Verifying credentials...
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
                          Please wait while we authenticate your account.
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Register link */}
            {activeStep === 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
                  New recruiter?{' '}
                  <Link href="/register" style={{ color: '#C8922A', fontWeight: 600, textDecoration: 'none' }}>
                    Register your company →
                  </Link>
                </Typography>
              </Box>
            )}

            {/* Quick links */}
            <Box
              sx={{
                mt: 4, pt: 3,
                borderTop: '1px solid rgba(10,22,40,0.06)',
                display: 'flex', justifyContent: 'center', gap: '20px',
              }}
            >
              {[
                { name: 'Home', path: '/' },
                { name: 'Brochure', path: '/brochure.html' },
                { name: 'Contact CDC', path: '/' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
