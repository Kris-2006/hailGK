'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const steps = ['Email Verification', 'Recruiter Details', 'Company Profile'];

const companyCategories = ['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO'];
const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
const turnoverRanges = ['Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr'];

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    designation: '',
    mobile: '',
    alt_mobile: '',
    password: '',
    password_confirmation: '',
    company_name: '',
    company_category: '',
    company_website: '',
    company_address: '',
    company_sector: '',
    company_nature: '',
    company_employees: '',
    company_establishment: '',
    company_turnover: '',
    linkedin_url: '',
    parent_hq_country: '',
    parent_hq_city: '',
    industry_tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: { target: { value: string } }) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.industry_tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        industry_tags: [...formData.industry_tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      industry_tags: formData.industry_tags.filter((t) => t !== tag),
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.sendOtp(formData.email);
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOtp(formData.email, formData.otp);
      setVerificationToken(response.data.verification_token);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        verification_token: verificationToken,
        ...formData,
      });

      const { token, user, company } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      if (company) {
        localStorage.setItem('auth_company', JSON.stringify(company));
      }

      setRegistrationComplete(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect countdown after successful registration
  useEffect(() => {
    if (!registrationComplete) return;
    if (countdown <= 0) {
      router.push('/dashboard');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [registrationComplete, countdown, router]);

  // ─── Label helper — consistent with JNF/INF ───
  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 600, mb: '8px' }}>
      {children} {required && <Box component="span" sx={{ color: '#DC2626' }}>*</Box>}
    </Typography>
  );

  // ─── Section header — matches JNF/INF section headers ───
  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 600, mb: 2.5 }}>
      {children}
    </Typography>
  );

  // ─── SUCCESS SCREEN ───
  if (registrationComplete) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F7F8FA' }}>
        {/* Top Strip */}
        <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.5)', fontSize: '12px', px: '2rem', py: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.02em', fontFamily: '"DM Sans", sans-serif' }}>
          <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        </Box>

        {/* Navbar */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(10,22,40,0.06)', px: '2rem', display: 'flex', alignItems: 'center', height: '64px', boxShadow: '0 1px 3px rgba(10,22,40,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: 1200, width: '100%', mx: 'auto' }}>
            <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 700, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
              <Typography sx={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Career Development Centre</Typography>
            </Box>
          </Box>
        </Box>

        {/* Success Content */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
          <Box sx={{ maxWidth: 520, mx: 'auto', px: '2rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <Box sx={{
              width: 72, height: 72, borderRadius: '50%',
              bgcolor: 'rgba(22,163,74,0.08)', border: '2px solid rgba(22,163,74,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
              animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes scaleIn': { '0%': { transform: 'scale(0.5)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
            }}>
              <Typography sx={{ fontSize: '32px', color: '#16A34A', lineHeight: 1 }}>✓</Typography>
            </Box>

            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '28px', fontWeight: 700, color: '#0A1628', lineHeight: 1.2, mb: 1.5, letterSpacing: '-0.02em' }}>
              Registration <Box component="span" sx={{ color: '#16A34A' }}>Successful</Box>
            </Typography>

            <Typography sx={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, mb: 4 }}>
              Your company account has been created. You can now access the CDC Recruitment Portal.
            </Typography>

            {/* Details Card */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid rgba(10,22,40,0.06)', borderRadius: '16px', p: 3.5, textAlign: 'left', mb: 4, boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}>
              <Typography sx={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 600, mb: 2 }}>Registration Details</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1.5 }}>
                <Typography sx={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Name</Typography>
                <Typography sx={{ fontSize: '14px', color: '#0A1628' }}>{formData.name}</Typography>
                <Typography sx={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Email</Typography>
                <Typography sx={{ fontSize: '14px', color: '#0A1628' }}>{formData.email}</Typography>
                <Typography sx={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Company</Typography>
                <Typography sx={{ fontSize: '14px', color: '#0A1628' }}>{formData.company_name}</Typography>
                <Typography sx={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Category</Typography>
                <Typography sx={{ fontSize: '14px', color: '#0A1628' }}>{formData.company_category}</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              id="go-to-dashboard"
              sx={{ bgcolor: '#C8922A', color: '#FEFEFE', fontSize: '15px', fontWeight: 600, px: 4, py: 1.5, borderRadius: '10px', '&:hover': { bgcolor: '#E8B64A' }, mb: 2, boxShadow: '0 4px 16px rgba(200,146,42,0.3)' }}
            >
              Go to Dashboard →
            </Button>
            <Typography sx={{ fontSize: '12px', color: '#94A3B8', fontFamily: '"JetBrains Mono", monospace' }}>
              Auto-redirecting in {countdown}s...
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.3)', py: 2.5, px: '2rem' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A', borderRadius: 1 }} />
              CDC Recruitment Portal v2.0 · IIT (ISM) Dhanbad
            </Box>
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F7F8FA' }}>
      {/* ─── Top Strip ─── */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          color: 'rgba(255,255,255,0.5)',
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
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '12px' }}>Home</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '12px' }}>Login</Link>
        </Box>
      </Box>

      {/* ─── Navbar — glassmorphism match ─── */}
      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(10,22,40,0.06)',
          px: '2rem',
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(10,22,40,0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: 1200, width: '100%', mx: 'auto' }}>
          <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 700, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
            <Typography sx={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Career Development Centre</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button component={Link} href="/login" size="small" sx={{ fontSize: '14px', color: '#0A1628', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', px: '18px', fontWeight: 600, '&:hover': { bgcolor: 'rgba(10,22,40,0.03)' } }}>
              Recruiter Login
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ─── Hero Banner — matching landing hero style ─── */}
      <Box sx={{ bgcolor: '#0A1628', position: 'relative', overflow: 'hidden', py: { xs: 4, md: 5 } }}>
        {/* Gradient orbs */}
        <Box sx={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,146,42,0.1) 0%, transparent 70%)', top: '-20%', right: '-5%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #C8922A, #E8B64A, #C8922A)' }} />
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', position: 'relative' }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            bgcolor: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.2)',
            color: '#E8B64A', px: '16px', py: '6px', borderRadius: '8px',
            fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, mb: 3,
          }}>
            <Box sx={{ width: 7, height: 7, bgcolor: '#E8B64A', borderRadius: '50%', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(0.8)' } } }} />
            Company Registration
          </Box>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: { xs: '28px', md: '38px' }, fontWeight: 700, color: '#FEFEFE', lineHeight: 1.1, mb: 1.5, letterSpacing: '-0.02em' }}>
            Register as a <Box component="span" sx={{ color: '#E8B64A' }}>Recruiter</Box>
          </Typography>
          <Typography sx={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: 520, lineHeight: 1.7 }}>
            Join 500+ companies recruiting from IIT (ISM) Dhanbad. Complete the 3-step registration to access JNF and INF submission portals.
          </Typography>
        </Box>
      </Box>

      {/* ─── Main Content ─── */}
      <Box sx={{ flex: 1, py: 5 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', px: '2rem' }}>

          {/* ─── Stepper — matching login/JNF style ─── */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              {steps.map((label, i) => {
                const isActive = activeStep === i;
                const isDone = i < activeStep;
                return (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%',
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
                    {i < steps.length - 1 && (
                      <Box sx={{
                        flex: 1, height: '2px', mx: 1.5,
                        bgcolor: isDone ? '#C8922A' : '#E2E8F0',
                        transition: 'background-color 0.5s',
                        borderRadius: 1,
                        display: { xs: 'none', sm: 'block' },
                      }} />
                    )}
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              {steps.map((label, i) => (
                <Box key={label} sx={{ flex: 1, pr: 1 }}>
                  <Typography sx={{
                    fontSize: '13px', fontWeight: activeStep === i ? 600 : 400,
                    color: activeStep === i ? '#0A1628' : '#94A3B8',
                    transition: 'all 0.3s',
                  }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 1.5, fontFamily: '"JetBrains Mono", monospace' }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          {/* ─── Form Card — matching JNF/INF card style ─── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(10,22,40,0.06)',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(10,22,40,0.06), 0 1px 3px rgba(10,22,40,0.04)',
            }}
          >
            {/* Card Header */}
            <Box sx={{
              borderBottom: '1px solid rgba(10,22,40,0.04)',
              bgcolor: 'rgba(247,248,250,0.5)',
              px: 4, py: 2.5,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 700, color: '#0A1628' }}>
                {steps[activeStep]}
              </Typography>
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#64748B', bgcolor: '#F1F5F9', px: '10px', py: '4px', borderRadius: '6px', fontWeight: 500 }}>
                {activeStep === 0 ? 'Verify Email' : activeStep === 1 ? 'Personal Info' : 'Company Details'}
              </Typography>
            </Box>

            {/* Card Body */}
            <Box sx={{ p: 4 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3, borderRadius: '10px',
                    bgcolor: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA',
                    '& .MuiAlert-icon': { color: '#DC2626' },
                    fontSize: '14px',
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {/* Step 0: Email Verification */}
              {activeStep === 0 && (
                <Box>
                  <SectionHeader>Email Verification</SectionHeader>

                  <Box sx={{ mb: 3 }}>
                    <FieldLabel required>Company Email Address</FieldLabel>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="recruiter@company.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      disabled={verificationToken !== ''}
                      size="small"
                      id="register-email"
                      helperText="Use your official company email address"
                    />
                  </Box>

                  {!otpSent ? (
                    <Button
                      variant="contained"
                      onClick={handleSendOtp}
                      disabled={loading || !formData.email}
                      id="send-otp-btn"
                      sx={{
                        bgcolor: '#0A1628',
                        color: '#FEFEFE',
                        px: 3,
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        '&:hover': { bgcolor: '#1A2A44' },
                      }}
                    >
                      {loading ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Send Verification OTP →'}
                    </Button>
                  ) : (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(10,22,40,0.06)' }}>
                      <Alert
                        severity="success"
                        sx={{
                          mb: 3, borderRadius: '10px',
                          bgcolor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          fontSize: '14px',
                        }}
                      >
                        OTP sent to <strong>{formData.email}</strong>. Check your inbox.
                      </Alert>

                      <Box sx={{ mb: 3 }}>
                        <FieldLabel required>Enter 6-digit OTP</FieldLabel>
                        <TextField
                          fullWidth
                          placeholder="000000"
                          value={formData.otp}
                          onChange={handleChange('otp')}
                          inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }}
                          size="small"
                          id="register-otp"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                          variant="contained"
                          onClick={handleVerifyOtp}
                          disabled={loading || formData.otp.length !== 6}
                          id="verify-otp-btn"
                          sx={{
                            bgcolor: '#C8922A', color: '#FEFEFE',
                            px: 3, fontSize: '14px', fontWeight: 600, borderRadius: '10px',
                            '&:hover': { bgcolor: '#E8B64A' },
                          }}
                        >
                          {loading ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Verify & Continue →'}
                        </Button>
                        <Button
                          variant="text"
                          onClick={handleSendOtp}
                          disabled={loading}
                          sx={{ fontSize: '13px', color: '#C8922A', fontWeight: 600 }}
                        >
                          Resend OTP
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Step 1: Recruiter Details */}
              {activeStep === 1 && (
                <Box>
                  <SectionHeader>Recruiter Information</SectionHeader>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <FieldLabel required>Full Name</FieldLabel>
                      <TextField fullWidth placeholder="John Doe" value={formData.name} onChange={handleChange('name')} required size="small" id="register-name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel required>Designation</FieldLabel>
                      <TextField fullWidth placeholder="HR Manager" value={formData.designation} onChange={handleChange('designation')} required size="small" id="register-designation" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel required>Mobile (+91)</FieldLabel>
                      <TextField fullWidth placeholder="+91 98765 43210" value={formData.mobile} onChange={handleChange('mobile')} required size="small" id="register-mobile" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Alternative Mobile</FieldLabel>
                      <TextField fullWidth placeholder="Optional" value={formData.alt_mobile} onChange={handleChange('alt_mobile')} size="small" id="register-alt-mobile" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel required>Password</FieldLabel>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange('password')}
                        required
                        size="small"
                        id="register-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#94A3B8' }}>
                                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FieldLabel required>Confirm Password</FieldLabel>
                      <TextField fullWidth type="password" placeholder="Re-enter password" value={formData.password_confirmation} onChange={handleChange('password_confirmation')} required size="small" id="register-confirm-password" />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 2: Company Profile */}
              {activeStep === 2 && (
                <Box>
                  <SectionHeader>Company Details</SectionHeader>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <FieldLabel required>Company Name</FieldLabel>
                      <TextField fullWidth placeholder="Acme Corporation" value={formData.company_name} onChange={handleChange('company_name')} required size="small" id="register-company-name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel required>Category</FieldLabel>
                      <FormControl fullWidth size="small" required>
                        <Select value={formData.company_category} onChange={handleSelectChange('company_category')} displayEmpty id="register-category">
                          <MenuItem value="" disabled>Select category</MenuItem>
                          {companyCategories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Website</FieldLabel>
                      <TextField fullWidth placeholder="https://company.com" value={formData.company_website} onChange={handleChange('company_website')} size="small" id="register-website" />
                    </Grid>
                    <Grid item xs={12}>
                      <FieldLabel>Postal Address</FieldLabel>
                      <TextField fullWidth multiline rows={2} placeholder="Registered office address" value={formData.company_address} onChange={handleChange('company_address')} size="small" id="register-address" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Sector</FieldLabel>
                      <TextField fullWidth placeholder="e.g., IT, Manufacturing" value={formData.company_sector} onChange={handleChange('company_sector')} size="small" id="register-sector" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Nature of Business</FieldLabel>
                      <TextField fullWidth placeholder="e.g., Product, Services" value={formData.company_nature} onChange={handleChange('company_nature')} size="small" id="register-nature" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>No. of Employees</FieldLabel>
                      <FormControl fullWidth size="small">
                        <Select value={formData.company_employees} onChange={handleSelectChange('company_employees')} displayEmpty id="register-employees">
                          <MenuItem value="" disabled>Select range</MenuItem>
                          {employeeRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Date of Establishment</FieldLabel>
                      <TextField fullWidth type="date" value={formData.company_establishment} onChange={handleChange('company_establishment')} InputLabelProps={{ shrink: true }} size="small" id="register-established" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>Annual Turnover (NIRF)</FieldLabel>
                      <FormControl fullWidth size="small">
                        <Select value={formData.company_turnover} onChange={handleSelectChange('company_turnover')} displayEmpty id="register-turnover">
                          <MenuItem value="" disabled>Select range</MenuItem>
                          {turnoverRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldLabel>LinkedIn URL</FieldLabel>
                      <TextField fullWidth placeholder="https://linkedin.com/company/..." value={formData.linkedin_url} onChange={handleChange('linkedin_url')} size="small" id="register-linkedin" />
                    </Grid>
                    {formData.company_category === 'MNC' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FieldLabel required>Parent HQ Country</FieldLabel>
                          <TextField fullWidth value={formData.parent_hq_country} onChange={handleChange('parent_hq_country')} required size="small" id="register-hq-country" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FieldLabel required>Parent HQ City</FieldLabel>
                          <TextField fullWidth value={formData.parent_hq_city} onChange={handleChange('parent_hq_city')} required size="small" id="register-hq-city" />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ height: '1px', bgcolor: 'rgba(10,22,40,0.04)', my: 1 }} />
                      <FieldLabel>Industry Tags</FieldLabel>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <TextField
                          placeholder="e.g., FinTech, AI, Cloud"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          size="small"
                          sx={{ flex: 1 }}
                          id="register-tag-input"
                        />
                        <Button
                          variant="outlined"
                          onClick={handleAddTag}
                          sx={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontSize: '13px', fontWeight: 600, minWidth: 70, borderRadius: '8px' }}
                          id="register-add-tag"
                        >
                          + Add
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {formData.industry_tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(200,146,42,0.06)',
                              color: '#0A1628',
                              fontSize: '13px',
                              fontWeight: 500,
                              borderRadius: '8px',
                              '& .MuiChip-deleteIcon': { fontSize: '16px', color: '#94A3B8' },
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* ─── Card Footer — Next/Prev buttons ─── */}
            <Box
              sx={{
                px: 4, py: 2.5,
                borderTop: '1px solid rgba(10,22,40,0.04)',
                bgcolor: 'rgba(247,248,250,0.5)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#94A3B8', fontFamily: '"JetBrains Mono", monospace' }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{
                      fontSize: '14px',
                      color: '#0A1628',
                      border: '1px solid rgba(10,22,40,0.12)',
                      borderRadius: '10px',
                      px: '22px',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'rgba(10,22,40,0.03)' },
                    }}
                    id="register-back"
                  >
                    ← Prev
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    id="register-next"
                    sx={{
                      bgcolor: '#0A1628',
                      color: '#FEFEFE',
                      fontSize: '14px',
                      px: '22px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#1A2A44' },
                    }}
                  >
                    Next →
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    id="register-submit"
                    sx={{
                      bgcolor: '#C8922A',
                      color: '#FEFEFE',
                      fontSize: '14px',
                      fontWeight: 700,
                      px: '28px',
                      borderRadius: '10px',
                      boxShadow: '0 4px 16px rgba(200,146,42,0.3)',
                      '&:hover': { bgcolor: '#E8B64A' },
                    }}
                  >
                    {loading ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Complete Registration →'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* Bottom Link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
              Already registered?{' '}
              <Link href="/login" style={{ color: '#C8922A', fontWeight: 600, textDecoration: 'none' }}>Login here →</Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Footer ─── */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.3)', py: 2.5, px: '2rem' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A', borderRadius: 1 }} />
            CDC Recruitment Portal v2.0 · IIT (ISM) Dhanbad
          </Box>
          <span>© {new Date().getFullYear()} All rights reserved</span>
        </Box>
      </Box>
    </Box>
  );
}
