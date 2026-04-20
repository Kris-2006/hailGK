'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const stats = [
  { value: '98', suffix: '', label: 'Years of Excellence' },
  { value: '500', suffix: '+', label: 'Recruiting Partners' },
  { value: '1200', suffix: '+', label: 'Offers (2024–25)' },
  { value: '32', suffix: '+', label: 'Departments' },
];

const usps = [
  { num: '01', tag: 'Heritage', title: 'Established in 1926', desc: 'Nearly a century of academic rigour and industry partnerships. India\'s oldest technical institute shaping energy, mining, and steel sectors.' },
  { num: '02', tag: 'Programmes', title: 'Unique specialisations', desc: 'India\'s only institute offering Petroleum Engineering, Mining Machinery, Applied Geophysics, and Earthquake Science at UG/PG levels.' },
  { num: '03', tag: 'Diversity', title: '32+ programmes', desc: 'Recruit from B.Tech, M.Tech, M.Sc, MBA (Analytics, Finance, Marketing), and Ph.D — all under one roof.' },
  { num: '04', tag: 'Rigour', title: 'JEE, GATE, CAT selectivity', desc: 'Every student clears a highly competitive national exam, ensuring demonstrated merit and problem-solving ability.' },
  { num: '05', tag: 'Industry', title: 'Deep corporate ties', desc: 'ONGC, Tata Steel, Infosys, Goldman Sachs, and 500+ companies have longstanding placement relationships.' },
  { num: '06', tag: 'Compliance', title: 'NIRF & AIPC aligned', desc: 'Structured, transparent, fully documented placement process aligned with national guidelines and regulatory requirements.' },
];

const processSteps = [
  { num: '01', label: 'Register Company', sub: 'Email OTP + company profile' },
  { num: '02', label: 'Select Portal', sub: 'JNF (full-time) or INF (internship)' },
  { num: '03', label: 'Fill Form', sub: 'Role, eligibility, salary, process' },
  { num: '04', label: 'Preview & Submit', sub: 'Declare, sign, and submit' },
  { num: '05', label: 'CDC Reviews', sub: 'Approval + email confirmation' },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F8FA' }}>
      {/* ─── TOP STRIP ─── */}
      <Box sx={{
        bgcolor: '#0A1628', color: 'rgba(255,255,255,0.5)',
        fontSize: '12px', px: '2rem', py: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        letterSpacing: '0.02em', fontFamily: '"DM Sans", sans-serif',
      }}>
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          {['NIRF Ranking', 'Institute Website', 'Contact CDC'].map((link) => (
            <Box key={link} component="a" href="#" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s', '&:hover': { color: '#E8B64A' } }}>{link}</Box>
          ))}
        </Box>
      </Box>

      {/* ─── NOTICE BAR ─── */}
      <Box sx={{
        background: 'linear-gradient(90deg, rgba(200,146,42,0.08) 0%, rgba(200,146,42,0.15) 50%, rgba(200,146,42,0.08) 100%)',
        borderBottom: '1px solid rgba(200,146,42,0.15)',
        px: '2rem', py: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        fontSize: '13px', color: '#0A1628',
      }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#C8922A', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
        <span><strong>Placement Season 2025–26 is now open.</strong> &nbsp;JNF submissions accepted until 30 November 2025.</span>
        <Box component="a" href="#" sx={{ color: '#C8922A', fontWeight: 600, ml: '6px', textDecoration: 'none' }}>View Schedule →</Box>
      </Box>

      {/* ─── NAVBAR ─── */}
      <Box sx={{
        bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(10,22,40,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(10,22,40,0.04)',
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', height: '68px' }}>
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 700, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
              <Typography sx={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Career Development Centre</Typography>
            </Box>
          </Box>
          <Box sx={{ width: '1px', height: 28, bgcolor: 'rgba(10,22,40,0.08)', ml: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0, flex: 1 }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Why IIT (ISM)', href: '#why' },
              { label: 'Programmes', href: '#' },
              { label: 'Past Recruiters', href: '#' },
              { label: 'Brochure', href: '/brochure.html' },
              { label: 'Contact', href: '#' }
            ].map((link) => (
              <Box key={link.label} component="a" href={link.href} target={link.href === '/brochure.html' ? "_blank" : undefined}
                sx={{ px: '14px', py: '8px', fontSize: '14px', color: '#64748B', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s', fontWeight: 500, '&:hover': { bgcolor: 'rgba(10,22,40,0.03)', color: '#0A1628' } }}
              >{link.label}</Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 'auto' }}>
            <Button component={Link} href="/login" sx={{ fontSize: '14px', color: '#0A1628', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', px: '20px', py: '7px', fontWeight: 600, '&:hover': { bgcolor: 'rgba(10,22,40,0.03)', borderColor: 'rgba(10,22,40,0.2)' } }}>Login</Button>
            <Button component={Link} href="/register" sx={{ fontSize: '14px', bgcolor: '#0A1628', color: '#FEFEFE', borderRadius: '8px', px: '20px', py: '7px', fontWeight: 600, '&:hover': { bgcolor: '#1A2A44' } }}>Register</Button>
          </Box>
        </Box>
      </Box>

      {/* ─── HERO ─── */}
      <Box sx={{ bgcolor: '#0A1628', position: 'relative', overflow: 'hidden' }}>
        {/* Gradient orbs */}
        <Box sx={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,146,42,0.1) 0%, transparent 70%)', top: '-20%', right: '-5%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,146,42,0.06) 0%, transparent 70%)', bottom: '-15%', left: '-5%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #C8922A, #E8B64A, #C8922A)' }} />

        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', py: { xs: '60px', md: '90px' }, pb: { xs: '80px', md: '110px' }, position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: '4rem', alignItems: 'center' }}>
          <Box>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              bgcolor: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.2)',
              color: '#E8B64A', px: '16px', py: '6px', borderRadius: '8px',
              fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, mb: 4,
            }}>
              <Box sx={{ width: 7, height: 7, bgcolor: '#E8B64A', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Recruitment Portal · v2.0
            </Box>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif', fontSize: { xs: '36px', md: '56px' },
              fontWeight: 700, color: '#FEFEFE', lineHeight: 1.05, mb: 3,
              letterSpacing: '-0.03em',
            }}>
              Recruit <Box component="span" sx={{ color: '#E8B64A' }}>exceptional</Box><br />talent from IIT ISM
            </Typography>
            <Typography sx={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.8, mb: 5 }}>
              Submit Job Notification Forms (JNF) and Intern Notification Forms (INF) for India&apos;s premier institute of technology, mining, and applied sciences.
            </Typography>
            <Box sx={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Button component={Link} href="/register" sx={{
                bgcolor: '#C8922A', color: '#0A1628', fontWeight: 700,
                px: '28px', py: '14px', fontSize: '15px', borderRadius: '10px',
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 4px 16px rgba(200,146,42,0.3)',
                '&:hover': { bgcolor: '#E8B64A', boxShadow: '0 6px 20px rgba(200,146,42,0.4)' },
              }}>
                Register as Recruiter
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>
              <Button component="a" href="/brochure.html" target="_blank" sx={{
                bgcolor: 'transparent', color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.15)', px: '28px', py: '14px',
                fontSize: '15px', borderRadius: '10px', fontWeight: 600,
                '&:hover': { borderColor: 'rgba(255,255,255,0.35)', bgcolor: 'rgba(255,255,255,0.04)' },
              }}>
                Download Brochure
              </Button>
            </Box>
          </Box>

          {/* Stats Card */}
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', p: 4, display: { xs: 'none', md: 'block' },
            backdropFilter: 'blur(8px)',
          }}>
            <Typography sx={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E8B64A', mb: 3, fontWeight: 600 }}>Placement at a Glance · 2024–25</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {[
                { val: '500+', label: 'Companies visit annually' },
                { val: '1200+', label: 'Offers distributed' },
                { val: '250+', label: 'Job profiles offered' },
                { val: '32+', label: 'Departments & programmes' },
              ].map((s) => (
                <Box key={s.label}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '34px', fontWeight: 700, color: '#FEFEFE', lineHeight: 1 }}>{s.val}</Typography>
                  <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', mt: '6px' }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'Placement Brochure 2025', href: '/brochure.html' },
                { label: 'AIPC Guidelines', href: '#' },
                { label: 'Past Recruiters List', href: '#' }
              ].map((link) => (
                <Box key={link.label} component="a" href={link.href} target={link.href !== '#' ? '_blank' : undefined}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: '14px', py: '10px', borderRadius: '8px',
                    bgcolor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#E8B64A' },
                  }}>
                  <span>{link.label}</span>
                  <span style={{ fontSize: '12px', opacity: 0.5 }}>↗</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── STATS BAR ─── */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A1628 0%, #1A2A44 100%)', py: 2.5 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          {stats.map((stat, i) => (
            <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {i > 0 && <Box sx={{ width: '1px', height: 32, bgcolor: 'rgba(200,146,42,0.15)', display: { xs: 'none', md: 'block' } }} />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', ml: i > 0 ? 2 : 0 }}>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '28px', fontWeight: 700, color: '#E8B64A', lineHeight: 1 }}>{stat.value}{stat.suffix}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', maxWidth: 100, lineHeight: 1.3 }}>{stat.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ─── WHY RECRUIT ─── */}
      <Box id="why" sx={{ py: 10 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 600, mb: 1 }}>Why IIT (ISM) Dhanbad</Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '38px', fontWeight: 700, color: '#0A1628', lineHeight: 1.15, letterSpacing: '-0.02em' }}>A legacy of engineering excellence</Typography>
          </Box>
          <Typography sx={{ fontSize: '16px', color: '#64748B', maxWidth: 560, lineHeight: 1.7 }}>Home to India&apos;s most specialised talent in mining, petroleum, earth sciences, and applied engineering.</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5, mt: 6 }}>
            {usps.map((usp) => (
              <Box key={usp.num} sx={{
                bgcolor: '#FFFFFF', border: '1px solid rgba(10,22,40,0.06)',
                borderRadius: '14px', p: 4, position: 'relative',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { boxShadow: '0 10px 30px rgba(10,22,40,0.08)', transform: 'translateY(-3px)' },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#C8922A', fontWeight: 600 }}>{usp.num}</Typography>
                  <Box sx={{ height: '1px', width: 16, bgcolor: 'rgba(200,146,42,0.3)' }} />
                  <Typography sx={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{usp.tag}</Typography>
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 600, color: '#0A1628', mb: 1.5, lineHeight: 1.3 }}>{usp.title}</Typography>
                <Typography sx={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>{usp.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── PORTAL CARDS ─── */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF', borderTop: '1px solid rgba(10,22,40,0.04)' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Typography sx={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 600, mb: 1 }}>Submit Your Requirements</Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '38px', fontWeight: 700, color: '#0A1628', lineHeight: 1.15, letterSpacing: '-0.02em', mb: 6 }}>Choose the right portal</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* JNF Card */}
            <Box component={Link} href="/register" sx={{
              bgcolor: '#FFFFFF', border: '1px solid rgba(10,22,40,0.06)',
              borderRadius: '16px', p: 5, position: 'relative', overflow: 'hidden',
              textDecoration: 'none', display: 'block',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { boxShadow: '0 16px 48px rgba(10,22,40,0.1)', transform: 'translateY(-4px)' },
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0A1628, #1A2A44)' }} />
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600, bgcolor: 'rgba(10,22,40,0.04)', color: '#0A1628', display: 'inline-flex', px: '12px', py: '5px', borderRadius: '6px', mb: 2.5 }}>JNF · Full-Time</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '26px', fontWeight: 700, color: '#0A1628', mb: 1.5, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Job Notification Form</Typography>
              <Typography sx={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, mb: 3.5 }}>For campus placement roles with detailed compensation — CTC breakdown, ESOP, joining bonus, and currency selector.</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
                {['Multi-step form', 'Auto-save', 'CTC grid', 'ESOP + Bond'].map((f) => (
                  <Box key={f} sx={{ fontSize: '12px', px: '12px', py: '5px', bgcolor: '#F7F8FA', border: '1px solid rgba(10,22,40,0.06)', borderRadius: '8px', color: '#64748B', fontWeight: 500 }}>{f}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0A1628', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Start JNF Submission
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Typography>
            </Box>

            {/* INF Card */}
            <Box component={Link} href="/register" sx={{
              bgcolor: '#FFFFFF', border: '1px solid rgba(10,22,40,0.06)',
              borderRadius: '16px', p: 5, position: 'relative', overflow: 'hidden',
              textDecoration: 'none', display: 'block',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { boxShadow: '0 16px 48px rgba(10,22,40,0.1)', transform: 'translateY(-4px)' },
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #C8922A, #E8B64A)' }} />
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600, bgcolor: 'rgba(200,146,42,0.06)', color: '#C8922A', display: 'inline-flex', px: '12px', py: '5px', borderRadius: '6px', mb: 2.5 }}>INF · Internship</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '26px', fontWeight: 700, color: '#0A1628', mb: 1.5, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Intern Notification Form</Typography>
              <Typography sx={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, mb: 3.5 }}>For summer and winter internship programmes — simplified stipend structure, expected duration, and PPO provision.</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
                {['Multi-step form', 'Auto-save', 'Stipend grid', 'PPO provision'].map((f) => (
                  <Box key={f} sx={{ fontSize: '12px', px: '12px', py: '5px', bgcolor: '#F7F8FA', border: '1px solid rgba(10,22,40,0.06)', borderRadius: '8px', color: '#64748B', fontWeight: 500 }}>{f}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0A1628', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Start INF Submission
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── PROCESS ─── */}
      <Box sx={{ py: 10, bgcolor: '#F7F8FA' }}>
        <Box sx={{ maxWidth: 640, mx: 'auto', px: '2rem', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8922A', fontWeight: 600, mb: 1.5 }}>How it Works</Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '38px', fontWeight: 700, color: '#0A1628', lineHeight: 1.15, letterSpacing: '-0.02em', mb: 1.5 }}>Simple 5-step process</Typography>
          <Typography sx={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7, mx: 'auto' }}>From registration to approval — structured, trackable, and transparent.</Typography>
        </Box>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', mt: 7 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 0, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 24, left: 'calc(10% + 16px)', right: 'calc(10% + 16px)', height: '2px', bgcolor: 'rgba(10,22,40,0.06)', display: { xs: 'none', md: 'block' } }} />
            {processSteps.map((step, i) => (
              <Box key={step.num} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, px: 1.5, textAlign: 'center' }}>
                <Box sx={{
                  width: 48, height: 48,
                  bgcolor: i === 0 ? '#0A1628' : '#FFFFFF',
                  border: `2px solid ${i === 0 ? '#0A1628' : 'rgba(10,22,40,0.1)'}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600,
                  color: i === 0 ? '#FEFEFE' : '#64748B',
                  position: 'relative', zIndex: 1, flexShrink: 0,
                  transition: 'all 0.2s',
                  boxShadow: i === 0 ? '0 4px 12px rgba(10,22,40,0.15)' : 'none',
                }}>{step.num}</Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0A1628', lineHeight: 1.3 }}>{step.label}</Typography>
                <Typography sx={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>{step.sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── FOOTER ─── */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.5)', pt: 7, pb: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: '3rem', pb: 5, borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 3 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '17px', fontWeight: 700, color: '#FEFEFE' }}>IIT (ISM) Dhanbad</Typography>
              <Typography sx={{ fontSize: '11px', color: '#C8922A', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 1.5 }}>CDC Recruitment Portal</Typography>
              <Typography sx={{ fontSize: '14px', lineHeight: 1.7, maxWidth: 300, color: 'rgba(255,255,255,0.35)' }}>A structured platform for companies to submit Job and Intern Notification Forms for campus recruitment.</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C8922A', mb: 2 }}>Portals</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Job Notification Form', 'Intern Notification Form', 'Recruiter Login', 'Register Company'].map((l) => (
                  <Box key={l} component="a" href="#" sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l}</Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C8922A', mb: 2 }}>Resources</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { label: 'Placement Brochure', href: '/brochure.html' },
                  { label: 'Past Recruiters', href: '#' },
                  { label: 'AIPC Guidelines', href: '#' },
                ].map((l) => (
                  <Box key={l.label} component="a" href={l.href} target={l.href !== '#' ? '_blank' : undefined} sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l.label}</Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C8922A', mb: 2 }}>Contact CDC</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>cdc@iitism.ac.in</Typography>
                <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>+91-326-223-5xxx</Typography>
                <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>CDC Building, IIT (ISM) Campus, Dhanbad — 826004</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A', borderRadius: 1 }} />
              CDC Recruitment Portal v2.0 · IIT (ISM) Dhanbad
            </Box>
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
