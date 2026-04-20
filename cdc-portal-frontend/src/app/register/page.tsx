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
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  LinearProgress,
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

  const handleSelectChange = (field: string) => (e: any) => {
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

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

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

  // ─── SUCCESS SCREEN ───
  if (registrationComplete) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Strip */}
        <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.7)', fontSize: '12px', px: '2rem', py: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.02em', fontFamily: '"DM Sans", sans-serif' }}>
          <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        </Box>

        {/* Navbar */}
        <Box sx={{ bgcolor: '#FEFEFE', borderBottom: '1px solid rgba(10,22,40,0.12)', px: '2rem', display: 'flex', alignItems: 'center', height: '60px', boxShadow: '0 2px 8px rgba(10,22,40,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: 1200, width: '100%', mx: 'auto' }}>
            <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: 600, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
              <Typography sx={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Career Development Centre</Typography>
            </Box>
          </Box>
        </Box>

        {/* Success Content */}
        <Box sx={{ flex: 1, bgcolor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
          <Box sx={{ maxWidth: 560, mx: 'auto', px: '2rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(29,107,58,0.1)', border: '2px solid rgba(29,107,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <Typography sx={{ fontSize: '36px', lineHeight: 1 }}>✓</Typography>
            </Box>

            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '32px', fontWeight: 500, color: '#0A1628', lineHeight: 1.2, mb: 1.5 }}>
              Registration <em style={{ color: '#1d6b3a' }}>Successful</em>
            </Typography>

            <Typography sx={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, mb: 4 }}>
              Your company account has been created successfully. You can now access the CDC Recruitment Portal to submit JNF and INF forms.
            </Typography>

            {/* Details Card */}
            <Box sx={{ bgcolor: '#FEFEFE', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', p: 3, textAlign: 'left', mb: 4, boxShadow: '0 2px 8px rgba(10,22,40,0.08)' }}>
              <Typography sx={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 500, mb: 2 }}>Registration Details</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1.5, fontSize: '13.5px' }}>
                <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Name</Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628' }}>{formData.name}</Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Email</Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628' }}>{formData.email}</Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Company</Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628' }}>{formData.company_name}</Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Category</Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628' }}>{formData.company_category}</Typography>
              </Box>
            </Box>

            {/* Redirect Info + Button */}
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              id="go-to-dashboard"
              sx={{ bgcolor: '#C8922A', color: '#FEFEFE', fontSize: '14px', fontWeight: 600, px: 4, py: 1.5, '&:hover': { bgcolor: '#E8B64A' }, mb: 2 }}
            >
              Go to Dashboard →
            </Button>
            <Typography sx={{ fontSize: '12px', color: '#64748B', fontFamily: '"JetBrains Mono", monospace' }}>
              Auto-redirecting in {countdown}s...
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.5)', py: 2.5, px: '2rem' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A' }} />
              CDC Recruitment Portal v1.0 · IIT (ISM) Dhanbad
            </Box>
            <span>Next.js · MUI · Laravel · MySQL</span>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Strip */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          px: '2rem',
          py: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.02em',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px' }}>Home</Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px' }}>Login</Link>
        </Box>
      </Box>

      {/* Navbar */}
      <Box
        sx={{
          bgcolor: '#FEFEFE',
          borderBottom: '1px solid rgba(10,22,40,0.12)',
          px: '2rem',
          display: 'flex',
          alignItems: 'center',
          height: '60px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(10,22,40,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: 1200, width: '100%', mx: 'auto' }}>
          <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: 600, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
            <Typography sx={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Career Development Centre</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button component={Link} href="/login" size="small" sx={{ fontSize: '13px', color: '#64748B', border: '1px solid rgba(10,22,40,0.15)', borderRadius: '8px', px: '16px' }}>
              Recruiter Login
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 4, md: 5 },
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(200,146,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#C8922A' }} />
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', position: 'relative' }}>
          <Typography component="div" sx={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', bgcolor: 'rgba(200,146,42,0.15)', border: '1px solid rgba(200,146,42,0.35)', color: '#E8B64A',
            px: '14px', py: '5px', borderRadius: '2px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, mb: 2,
          }}>
            <Box component="span" sx={{ width: 6, height: 6, bgcolor: '#E8B64A', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            Company Registration
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: { xs: '28px', md: '36px' }, fontWeight: 500, color: '#FEFEFE', lineHeight: 1.15, mb: 1 }}>
            Register as a <em style={{ color: '#E8B64A' }}>Recruiter</em>
          </Typography>
          <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: 520, lineHeight: 1.7 }}>
            Join 500+ companies recruiting from IIT (ISM) Dhanbad. Complete the 3-step registration to access JNF and INF submission portals.
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, bgcolor: '#F4F6F9', py: 5 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', px: '2rem' }}>
          {/* Step Indicators */}
          <Box sx={{ mb: 4 }}>
            {/* Row 1: Circles with connecting lines */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              {steps.map((label, index) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', flex: index < steps.length - 1 ? 1 : 'none' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 500,
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      ...(index < activeStep
                        ? { bgcolor: '#C8922A', color: '#FEFEFE' }
                        : index === activeStep
                          ? { bgcolor: '#0A1628', color: '#FEFEFE' }
                          : { bgcolor: '#FEFEFE', color: '#64748B', border: '2px solid rgba(10,22,40,0.12)' }),
                    }}
                  >
                    {index < activeStep ? '✓' : `0${index + 1}`}
                  </Box>
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        height: '1px',
                        mx: 1,
                        bgcolor: index < activeStep ? '#C8922A' : 'rgba(10,22,40,0.12)',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
            {/* Row 2: Labels */}
            <Box sx={{ display: 'flex' }}>
              {steps.map((label, index) => (
                <Box key={label} sx={{ flex: 1, pr: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: index === activeStep ? 600 : 400, color: index === activeStep ? '#0A1628' : '#64748B', lineHeight: 1.2 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: 'rgba(10,22,40,0.06)',
                '& .MuiLinearProgress-bar': { bgcolor: '#C8922A', borderRadius: 2 },
              }}
            />
            <Typography sx={{ fontSize: '11.5px', color: '#64748B', mt: 1, fontFamily: '"JetBrains Mono", monospace' }}>
              Step {activeStep + 1} of {steps.length} · {Math.round(progressPercent)}% complete
            </Typography>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              bgcolor: '#FEFEFE',
              borderRadius: '8px',
              border: '1px solid rgba(10,22,40,0.12)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
            }}
          >
            {/* Form Header */}
            <Box sx={{ bgcolor: '#F4F6F9', borderBottom: '1px solid rgba(10,22,40,0.12)', px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>
                {steps[activeStep]}
              </Typography>
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#64748B', bgcolor: '#E8EBF0', px: '8px', py: '3px', borderRadius: '8px' }}>
                {activeStep === 0 ? 'Verify Email' : activeStep === 1 ? 'Personal Info' : 'Company Details'}
              </Typography>
            </Box>

            {/* Form Body */}
            <Box sx={{ p: 3 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(139,26,26,0.08)',
                    color: '#DC2626',
                    borderRadius: '8px',
                    border: '1px solid rgba(139,26,26,0.15)',
                    '& .MuiAlert-icon': { color: '#DC2626' },
                    fontSize: '13px',
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {/* Step 0: Email Verification */}
              {activeStep === 0 && (
                <Box>
                  <Typography sx={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 500, mb: 2 }}>
                    Email Verification
                  </Typography>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                      Company Email Address <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                    </Typography>
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
                        fontSize: '13px',
                        '&:hover': { bgcolor: '#2C3345' },
                      }}
                    >
                      {loading ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Send Verification OTP →'}
                    </Button>
                  ) : (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(10,22,40,0.08)' }}>
                      <Alert
                        severity="success"
                        sx={{
                          mb: 3,
                          bgcolor: 'rgba(29,107,58,0.08)',
                          borderRadius: '8px',
                          border: '1px solid rgba(29,107,58,0.15)',
                          fontSize: '13px',
                        }}
                      >
                        OTP sent to <strong>{formData.email}</strong>. Check your inbox.
                      </Alert>

                      <Box sx={{ mb: 2.5 }}>
                        <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                          Enter 6-digit OTP <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="000000"
                          value={formData.otp}
                          onChange={handleChange('otp')}
                          inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontFamily: '"JetBrains Mono", monospace', fontWeight: 500 } }}
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
                            bgcolor: '#C8922A',
                            color: '#FEFEFE',
                            px: 3,
                            fontSize: '13px',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#E8B64A' },
                          }}
                        >
                          {loading ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Verify & Continue →'}
                        </Button>
                        <Button
                          variant="text"
                          onClick={handleSendOtp}
                          disabled={loading}
                          sx={{ fontSize: '12.5px', color: '#C8922A' }}
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
                  <Typography sx={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 500, mb: 2 }}>
                    Recruiter Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Full Name <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <TextField fullWidth placeholder="John Doe" value={formData.name} onChange={handleChange('name')} required size="small" id="register-name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Designation <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <TextField fullWidth placeholder="HR Manager" value={formData.designation} onChange={handleChange('designation')} required size="small" id="register-designation" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Mobile (+91) <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <TextField fullWidth placeholder="+91 98765 43210" value={formData.mobile} onChange={handleChange('mobile')} required size="small" id="register-mobile" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Alternative Mobile</Typography>
                      <TextField fullWidth placeholder="Optional" value={formData.alt_mobile} onChange={handleChange('alt_mobile')} size="small" id="register-alt-mobile" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Password <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
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
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#64748B' }}>
                                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Confirm Password <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <TextField fullWidth type="password" placeholder="Re-enter password" value={formData.password_confirmation} onChange={handleChange('password_confirmation')} required size="small" id="register-confirm-password" />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 2: Company Profile */}
              {activeStep === 2 && (
                <Box>
                  <Typography sx={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 500, mb: 2 }}>
                    Company Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Company Name <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <TextField fullWidth placeholder="Acme Corporation" value={formData.company_name} onChange={handleChange('company_name')} required size="small" id="register-company-name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                        Category <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                      </Typography>
                      <FormControl fullWidth size="small" required>
                        <Select value={formData.company_category} onChange={handleSelectChange('company_category')} displayEmpty id="register-category">
                          <MenuItem value="" disabled>Select category</MenuItem>
                          {companyCategories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Website</Typography>
                      <TextField fullWidth placeholder="https://company.com" value={formData.company_website} onChange={handleChange('company_website')} size="small" id="register-website" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Postal Address</Typography>
                      <TextField fullWidth multiline rows={2} placeholder="Registered office address" value={formData.company_address} onChange={handleChange('company_address')} size="small" id="register-address" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Sector</Typography>
                      <TextField fullWidth placeholder="e.g., IT, Manufacturing" value={formData.company_sector} onChange={handleChange('company_sector')} size="small" id="register-sector" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Nature of Business</Typography>
                      <TextField fullWidth placeholder="e.g., Product, Services" value={formData.company_nature} onChange={handleChange('company_nature')} size="small" id="register-nature" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>No. of Employees</Typography>
                      <FormControl fullWidth size="small">
                        <Select value={formData.company_employees} onChange={handleSelectChange('company_employees')} displayEmpty id="register-employees">
                          <MenuItem value="" disabled>Select range</MenuItem>
                          {employeeRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Date of Establishment</Typography>
                      <TextField fullWidth type="date" value={formData.company_establishment} onChange={handleChange('company_establishment')} InputLabelProps={{ shrink: true }} size="small" id="register-established" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Annual Turnover (NIRF)</Typography>
                      <FormControl fullWidth size="small">
                        <Select value={formData.company_turnover} onChange={handleSelectChange('company_turnover')} displayEmpty id="register-turnover">
                          <MenuItem value="" disabled>Select range</MenuItem>
                          {turnoverRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>LinkedIn URL</Typography>
                      <TextField fullWidth placeholder="https://linkedin.com/company/..." value={formData.linkedin_url} onChange={handleChange('linkedin_url')} size="small" id="register-linkedin" />
                    </Grid>
                    {formData.company_category === 'MNC' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                            Parent HQ Country <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                          </Typography>
                          <TextField fullWidth value={formData.parent_hq_country} onChange={handleChange('parent_hq_country')} required size="small" id="register-hq-country" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>
                            Parent HQ City <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                          </Typography>
                          <TextField fullWidth value={formData.parent_hq_city} onChange={handleChange('parent_hq_city')} required size="small" id="register-hq-city" />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ height: '1px', bgcolor: 'rgba(10,22,40,0.08)', my: 1 }} />
                      <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mb: '6px' }}>Industry Tags</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                          sx={{ borderColor: 'rgba(10,22,40,0.15)', color: '#0A1628', fontSize: '12.5px', minWidth: 60 }}
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
                              bgcolor: 'rgba(10,22,40,0.06)',
                              color: '#0A1628',
                              fontSize: '12px',
                              '& .MuiChip-deleteIcon': { fontSize: '16px', color: '#64748B' },
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Form Footer */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid rgba(10,22,40,0.12)',
                bgcolor: '#F4F6F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{
                      fontSize: '13px',
                      color: '#0A1628',
                      border: '1px solid rgba(10,22,40,0.2)',
                      borderRadius: '8px',
                      px: '20px',
                      '&:hover': { bgcolor: '#F4F6F9' },
                    }}
                    id="register-back"
                  >
                    ← Back
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
                      fontSize: '13px',
                      px: '20px',
                      '&:hover': { bgcolor: '#2C3345' },
                    }}
                  >
                    Save & Continue →
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
                      fontSize: '13px',
                      fontWeight: 600,
                      px: '24px',
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
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#64748B' }}>
              Already registered?{' '}
              <Link href="/login" style={{ color: '#C8922A', fontWeight: 500, textDecoration: 'none' }}>Login here →</Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.5)', py: 2.5, px: '2rem' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A' }} />
            CDC Recruitment Portal v1.0 · IIT (ISM) Dhanbad
          </Box>
          <span>Next.js · MUI · Laravel · MySQL</span>
        </Box>
      </Box>
    </Box>
  );
}
