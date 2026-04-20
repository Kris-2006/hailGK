'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/lib/auth';
import { notificationsApi, companyApi } from '@/lib/api';
import { Notification } from '@/types';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import CompanyProfile from './profile';
import CompanyContacts from './contacts';
const statusStyleMap: Record<string, { bgcolor: string; color: string; border?: string }> = {
  draft: { bgcolor: 'rgba(100,116,139,0.08)', color: '#64748B' },
  submitted: { bgcolor: 'rgba(10,22,40,0.06)', color: '#0A1628' },
  under_review: { bgcolor: 'rgba(200,146,42,0.1)', color: '#C8922A' },
  approved: { bgcolor: 'rgba(22,163,74,0.08)', color: '#16A34A' },
  rejected: { bgcolor: 'rgba(220,38,38,0.08)', color: '#DC2626' },
  changes_requested: { bgcolor: 'rgba(217,119,6,0.08)', color: '#D97706' },
};

export default function DashboardPage() {
  const { user, company, logout } = useAuth();

  const isRecruiter = user?.role === 'recruiter';

  const { data: notificationsData, isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
  });
  const notifications: Notification[] = notificationsData?.data?.notifications || [];

  const { data: companyResponse } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: companyApi.get,
    enabled: !!isRecruiter,
  });

  const { data: contactsResponse } = useQuery({
    queryKey: ['companyContacts'],
    queryFn: companyApi.getContacts,
    enabled: !!isRecruiter,
  });

  const contacts = contactsResponse?.data?.contacts || [];
  const hasHeadHr = contacts.some((c: any) => c.type === 'head_hr' && Boolean(c.name));
  const hasPrimaryPoc = contacts.some((c: any) => c.type === 'poc1' && Boolean(c.name));

  const freshCompany = companyResponse?.data?.company || company;
  const isCompanyProfileComplete = Boolean(freshCompany?.category && freshCompany?.sector);
  const isContactsComplete = hasHeadHr && hasPrimaryPoc;

  let currentWorkflowStep = 1;
  if (isCompanyProfileComplete) currentWorkflowStep = 2;
  if (isCompanyProfileComplete && isContactsComplete) currentWorkflowStep = 3;
  if (isCompanyProfileComplete && isContactsComplete && notifications.length > 0) currentWorkflowStep = 4;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeSideItem, setActiveSideItem] = useState('Submissions');
  const [newFormData, setNewFormData] = useState({
    type: 'jnf' as 'jnf' | 'inf',
    season: new Date().getMonth() < 7 ? 1 : 2,
    year: new Date().getFullYear(),
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const sidebarItems = user?.role === 'recruiter' ? [
    { label: 'Submissions' },
    { label: 'Company Profile' },
    { label: 'Contacts & HR' },
  ] : [
    { label: 'Submissions' },
    { label: 'Analytics' },
    { label: 'Recruiters' },
    { label: 'Export Data' },
    { label: 'Audit Log' },
  ];

  const createMutation = useMutation({
    mutationFn: (data: any) => notificationsApi.create(data),
    onSuccess: (response: any) => {
      const notification = response.data.notification;
      if (newFormData.type === 'jnf') {
        window.location.href = `/jnf/${notification.id}`;
      } else {
        window.location.href = `/inf/${notification.id}`;
      }
    },
    onError: (error: any) => {
      console.error('Failed to create notification:', error);
    }
  });

  const handleCreate = () => createMutation.mutate(newFormData);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const filteredNotifications = statusFilter === 'all'
    ? notifications
    : notifications.filter(n => n.status === statusFilter);

  // Calculate metrics
  const totalSubmissions = notifications.length;
  const approvedCount = notifications.filter(n => n.status === 'approved').length;
  const reviewCount = notifications.filter(n => n.status === 'under_review').length;
  const pendingCount = notifications.filter(n => n.status === 'draft' || n.status === 'submitted').length;

  const metrics = [
    { value: totalSubmissions, label: 'Total submissions' },
    { value: approvedCount, label: 'Approved' },
    { value: reviewCount, label: 'Under Review' },
    { value: pendingCount, label: 'Drafts / Pending' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Strip */}
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
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '12px' }}>Home</Link>
          <Box sx={{ width: '1px', height: 12, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</span>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 240,
            background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          {/* Sidebar Logo */}
          <Box sx={{ px: 2.5, pt: 3, pb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Company Logo */}
            {freshCompany?.logo_path ? (
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${freshCompany.logo_path}`}
                alt={freshCompany?.name || 'Company logo'}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  objectFit: 'contain',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(200,146,42,0.2), rgba(200,146,42,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#E8B64A',
                }}
              >
                {(company?.name || user?.name || 'D').charAt(0).toUpperCase()}
              </Box>
            )}
            {/* Name + Email */}
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '14px', color: '#FEFEFE', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {company?.name || user?.name || 'Dashboard'}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.role === 'admin' ? 'CDC Admin Panel' : (user?.email || 'Recruiter Portal')}
              </Typography>
            </Box>
          </Box>

          {/* Nav Items */}
          {sidebarItems.map((item) => (
            <Box
              key={item.label}
              onClick={() => setActiveSideItem(item.label)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                px: 2.5,
                py: '10px',
                mx: 1,
                mb: 0.5,
                fontSize: '14px',
                fontWeight: activeSideItem === item.label ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '8px',
                color: activeSideItem === item.label ? '#E8B64A' : 'rgba(255,255,255,0.5)',
                bgcolor: activeSideItem === item.label ? 'rgba(200,146,42,0.08)' : 'transparent',
                '&:hover': {
                  color: 'rgba(255,255,255,0.85)',
                  bgcolor: 'rgba(255,255,255,0.04)',
                },
              }}
            >
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: activeSideItem === item.label ? '#C8922A' : 'currentColor', opacity: activeSideItem === item.label ? 1 : 0.4, flexShrink: 0 }} />
              {item.label}
            </Box>
          ))}

          {/* Settings at bottom */}
          <Box sx={{ mt: 'auto' }}>
            <Box
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                px: 2.5,
                py: '10px',
                mx: 1,
                mb: 2,
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s',
                '&:hover': { color: '#DC2626', bgcolor: 'rgba(220,38,38,0.06)' },
              }}
              id="logout-btn"
            >
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.5, flexShrink: 0 }} />
              Sign Out
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#F7F8FA' }}>
          {/* Top Bar */}
          <Box
            sx={{
              px: 4,
              py: 3,
              bgcolor: '#FFFFFF',
              borderBottom: '1px solid rgba(10,22,40,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {activeSideItem === 'Submissions' ? (
                <>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '32px', fontWeight: 700, color: '#0A1628', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                    Greetings, <Box component="span" sx={{ fontSize: '20px', fontWeight: 500, color: '#C8922A' }}>{user?.name || company?.name || 'Recruiter'}</Box>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '20px', fontWeight: 700, color: '#0A1628', letterSpacing: '-0.01em' }}>
                    {activeSideItem}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#64748B', mt: '4px' }}>
                    {company?.name || user?.name} · {user?.role === 'admin' ? 'CDC Admin Dashboard' : 'Recruiter Dashboard'}
                  </Typography>
                </>
              )}
            </Box>

            {activeSideItem === 'Submissions' && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '13px',
                    minWidth: 130,
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(10,22,40,0.1)' },
                  }}
                  id="status-filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="under_review">Under Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
                <Button
                  sx={{
                    fontSize: '13px',
                    color: '#0A1628',
                    border: '1px solid rgba(10,22,40,0.1)',
                    borderRadius: '8px',
                    px: '16px',
                    py: '6px',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(10,22,40,0.03)' },
                  }}
                  id="export-btn"
                >
                  Export .xlsx
                </Button>
              </Box>
            )}
          </Box>

          {activeSideItem === 'Submissions' && (
            <>
              {/* Workflow Banner for Recruiters */}
              {isRecruiter && currentWorkflowStep < 4 && (
                <Box sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#FFFFFF', borderBottom: '1px solid rgba(10,22,40,0.04)' }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#C8922A', mb: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Onboarding Progress
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ flex: 1, p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: currentWorkflowStep > 1 ? 'rgba(200,146,42,0.2)' : 'rgba(10,22,40,0.06)', bgcolor: currentWorkflowStep > 1 ? 'rgba(200,146,42,0.04)' : '#FFFFFF', position: 'relative', transition: 'all 0.2s' }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: currentWorkflowStep > 1 ? '#16A34A' : '#C8922A', mb: 0.5 }}>STEP 1</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Company Profile</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.5 }}>{currentWorkflowStep > 1 ? '✓ Complete' : 'Pending Review'}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: currentWorkflowStep > 2 ? 'rgba(200,146,42,0.2)' : 'rgba(10,22,40,0.06)', bgcolor: currentWorkflowStep > 2 ? 'rgba(200,146,42,0.04)' : '#FFFFFF', opacity: currentWorkflowStep < 2 ? 0.5 : 1, transition: 'all 0.2s' }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: currentWorkflowStep > 2 ? '#16A34A' : currentWorkflowStep === 2 ? '#C8922A' : '#94A3B8', mb: 0.5 }}>STEP 2</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Contacts & HR</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.5 }}>{currentWorkflowStep > 2 ? '✓ Complete' : 'Requires Head HR & PoC1'}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: currentWorkflowStep >= 3 ? 'rgba(200,146,42,0.2)' : 'rgba(10,22,40,0.06)', bgcolor: currentWorkflowStep >= 3 ? 'rgba(200,146,42,0.04)' : '#FFFFFF', opacity: currentWorkflowStep < 3 ? 0.5 : 1, transition: 'all 0.2s' }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: currentWorkflowStep === 3 ? '#16A34A' : '#94A3B8', mb: 0.5 }}>STEP 3</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>JNF / INF Filing</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.5 }}>{currentWorkflowStep === 3 ? '✓ Unlocked' : 'Complete previous steps'}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Metrics */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 2,
                  px: 4,
                  py: 3,
                  borderBottom: '1px solid rgba(10,22,40,0.04)',
                }}
              >
                {metrics.map((metric) => (
                  <Box
                    key={metric.label}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(10,22,40,0.04)',
                      p: 2.5,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 2px 8px rgba(10,22,40,0.04)' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0A1628',
                        lineHeight: 1,
                        mb: '6px',
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                      {metric.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Action Bar */}
              <Box sx={{ px: 4, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#FFFFFF', borderBottom: '1px solid rgba(10,22,40,0.04)' }}>
                <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0A1628' }}>
                  My Submissions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    onClick={() => { setNewFormData({ ...newFormData, type: 'jnf' }); setCreateDialogOpen(true); }}
                    id="new-jnf-btn"
                    disabled={currentWorkflowStep < 3 && isRecruiter}
                    sx={{
                      bgcolor: currentWorkflowStep < 3 && isRecruiter ? 'rgba(10,22,40,0.06)' : '#0A1628',
                      color: currentWorkflowStep < 3 && isRecruiter ? 'rgba(10,22,40,0.3)' : '#FEFEFE',
                      fontSize: '13px',
                      px: '18px',
                      py: '7px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      '&:hover': { bgcolor: currentWorkflowStep < 3 && isRecruiter ? 'rgba(10,22,40,0.06)' : '#1A2A44' },
                    }}
                  >
                    + New JNF
                  </Button>
                  <Button
                    onClick={() => { setNewFormData({ ...newFormData, type: 'inf' }); setCreateDialogOpen(true); }}
                    id="new-inf-btn"
                    disabled={currentWorkflowStep < 3 && isRecruiter}
                    sx={{
                      fontSize: '13px',
                      color: currentWorkflowStep < 3 && isRecruiter ? 'rgba(10,22,40,0.3)' : '#C8922A',
                      border: '1px solid',
                      borderColor: currentWorkflowStep < 3 && isRecruiter ? 'rgba(10,22,40,0.06)' : 'rgba(200,146,42,0.25)',
                      borderRadius: '8px',
                      px: '18px',
                      py: '7px',
                      fontWeight: 600,
                      '&:hover': { bgcolor: currentWorkflowStep < 3 && isRecruiter ? 'transparent' : 'rgba(200,146,42,0.04)' },
                    }}
                  >
                    + New INF
                  </Button>
                </Box>
              </Box>

              {/* Table */}
              <Box sx={{ flex: 1, overflow: 'auto', px: 4, py: 1, bgcolor: '#FFFFFF', mx: 4, my: 2, borderRadius: '12px', border: '1px solid rgba(10,22,40,0.04)' }}>
                <TableContainer>
                  <Table sx={{ '& td, & th': { borderBottomColor: 'rgba(10,22,40,0.08)' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Job Title</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Reference</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Season</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Submitted</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                            <CircularProgress size={28} sx={{ color: '#0A1628' }} />
                          </TableCell>
                        </TableRow>
                      ) : filteredNotifications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                            <Box>
                              <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 1 }}>
                                No submissions yet
                              </Typography>
                              <Typography sx={{ fontSize: '12.5px', color: '#5A6478', opacity: 0.7 }}>
                                Create your first JNF or INF using the buttons above.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <TableRow key={notification.id} sx={{ '&:hover td': { bgcolor: '#F4F6F9' }, transition: 'background 0.1s' }}>
                            <TableCell sx={{ fontWeight: 500, fontSize: '13px', color: '#0A1628' }}>
                              {notification.type === 'jnf'
                                ? (notification.job_profile?.profile_name || '—')
                                : (notification.intern_profile?.title || '—')}
                            </TableCell>
                            <TableCell>
                              <Box
                                component="span"
                                sx={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  px: '7px',
                                  py: '2px',
                                  borderRadius: '3px',
                                  ...(notification.type === 'jnf'
                                    ? { bgcolor: 'rgba(10,22,40,0.06)', color: '#0A1628' }
                                    : { bgcolor: 'rgba(27,94,107,0.08)', color: '#1B5E6B' }),
                                }}
                              >
                                {notification.type.toUpperCase()}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontSize: '12.5px', color: '#5A6478', fontFamily: '"JetBrains Mono", monospace' }}>
                              {notification.reference_number}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12.5px', color: '#5A6478' }}>
                              {notification.year} — {notification.season === 1 ? 'S1' : 'S2'}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12.5px', color: '#5A6478' }}>
                              {notification.submitted_at
                                ? new Date(notification.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '—'}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                                <Box
                                  component="span"
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    px: '10px',
                                    py: '3px',
                                    borderRadius: '20px',
                                    fontSize: '11.5px',
                                    fontWeight: 500,
                                    ...(statusStyleMap[notification.status] || statusStyleMap['draft']),
                                  }}
                                >
                                  {notification.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                                </Box>
                                {notification.review_notes && (
                                  <Typography sx={{ fontSize: '10.5px', color: '#5A6478', fontStyle: 'italic', maxWidth: '200px', lineHeight: 1.2 }}>
                                    ↳ {notification.review_notes}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                <Tooltip title={['draft', 'changes_requested'].includes(notification.status) ? "Edit submission" : "View submission"}>
                                  <IconButton
                                    component={Link}
                                    href={`/${notification.type}/${notification.id}`}
                                    size="small"
                                    sx={{ p: '6px', borderRadius: '8px', color: '#0A1628', '&:hover': { bgcolor: 'rgba(10,22,40,0.04)' } }}
                                  >
                                    {['draft', 'changes_requested'].includes(notification.status) ? <EditIcon sx={{ fontSize: '17px' }} /> : <VisibilityIcon sx={{ fontSize: '17px' }} />}
                                  </IconButton>
                                </Tooltip>
                                {['draft', 'changes_requested'].includes(notification.status) && (
                                  <Tooltip title="Preview form">
                                    <IconButton
                                      component={Link}
                                      href={`/${notification.type}/${notification.id}/preview`}
                                      size="small"
                                      sx={{ p: '6px', borderRadius: '8px', color: '#64748B', '&:hover': { bgcolor: 'rgba(10,22,40,0.04)' } }}
                                    >
                                      <VisibilityIcon sx={{ fontSize: '17px' }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Duplicate for this season">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      if (confirm('Duplicate this submission for the current season?')) {
                                        notificationsApi.duplicate(notification.id).then(() => {
                                          window.location.reload();
                                        }).catch(() => alert('Failed to duplicate.'));
                                      }
                                    }}
                                    sx={{ p: '6px', borderRadius: '8px', color: '#C8922A', bgcolor: 'rgba(200,146,42,0.06)', transition: 'all 0.2s ease', '&:hover': { color: '#E8B64A', bgcolor: 'rgba(200,146,42,0.12)', transform: 'scale(1.05)' } }}
                                  >
                                    <ForkRightIcon sx={{ fontSize: '20px' }} />
                                  </IconButton>
                                </Tooltip>
                                {notification.status === 'draft' && (
                                  <Tooltip title="Delete permanently">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        if (confirm('Delete this draft permanently?')) {
                                          notificationsApi.delete(notification.id).then(() => {
                                            window.location.reload();
                                          }).catch(() => alert('Failed to delete.'));
                                        }
                                      }}
                                      sx={{ p: '6px', borderRadius: '8px', color: '#DC2626', opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'rgba(220,38,38,0.06)' } }}
                                    >
                                      <DeleteIcon sx={{ fontSize: '17px' }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile Sign Out */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, px: 3, py: 2, borderTop: '1px solid rgba(10,22,40,0.12)' }}>
                <Button onClick={handleLogout} fullWidth sx={{ fontSize: '13px', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '8px', fontWeight: 600 }}>
                  Sign Out
                </Button>
              </Box>
            </>
          )}

          {activeSideItem === 'Company Profile' && <CompanyProfile />}
          {activeSideItem === 'Contacts & HR' && <CompanyContacts />}

        </Box>
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid rgba(10,22,40,0.06)',
            maxWidth: 420,
            width: '100%',
            boxShadow: '0 20px 60px rgba(10,22,40,0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '20px', fontWeight: 700, color: '#0A1628' }}>
            New Submission
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#64748B', mt: '6px' }}>
            Create a new JNF or INF form
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Type</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.type}
                  onChange={(e) => setNewFormData({ ...newFormData, type: e.target.value as 'jnf' | 'inf' })}
                  id="create-type"
                >
                  <MenuItem value="jnf">Job Notification Form (JNF)</MenuItem>
                  <MenuItem value="inf">Intern Notification Form (INF)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Season</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.season}
                  onChange={(e) => setNewFormData({ ...newFormData, season: e.target.value as number })}
                  id="create-season"
                >
                  <MenuItem value={1}>First Semester</MenuItem>
                  <MenuItem value={2}>Second Semester</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Year</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.year}
                  onChange={(e) => setNewFormData({ ...newFormData, year: e.target.value as number })}
                  id="create-year"
                >
                  {[2025, 2026, 2027].map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            sx={{ fontSize: '14px', color: '#64748B', border: '1px solid rgba(10,22,40,0.1)', borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createMutation.isPending}
            id="create-submit"
            sx={{
              bgcolor: '#0A1628',
              color: '#FEFEFE',
              fontSize: '14px',
              borderRadius: '8px',
              fontWeight: 600,
              '&:hover': { bgcolor: '#1A2A44' },
            }}
          >
            {createMutation.isPending ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Create →'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
