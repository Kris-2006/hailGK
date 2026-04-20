'use client';

import { createTheme } from '@mui/material/styles';

// ── ISM Design System v2 ── Refined Navy + Gold + Greys ──
const theme = createTheme({
  palette: {
    primary: {
      main: '#0A1628',
      light: '#1A2A44',
      dark: '#060E1A',
      contrastText: '#FEFEFE',
    },
    secondary: {
      main: '#C8922A',
      light: '#E8B64A',
      dark: '#9A7020',
      contrastText: '#0A1628',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A1628',
      secondary: '#64748B',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7',
    },
    info: {
      main: '#0A1628',
      light: '#E0E7FF',
    },
    divider: 'rgba(10,22,40,0.08)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Inter", "DM Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Inter", "DM Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Inter", "DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontFamily: '"Inter", "DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: '"Inter", "DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#64748B',
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      color: '#C8922A',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.65,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.02em',
      fontWeight: 500,
      color: '#64748B',
    },
    overline: {
      fontSize: '0.6875rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(10,22,40,0.08), 0 1px 2px rgba(10,22,40,0.06)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(10,22,40,0.15), 0 2px 4px rgba(10,22,40,0.08)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0A1628',
          color: '#FEFEFE',
          '&:hover': {
            backgroundColor: '#1A2A44',
          },
        },
        containedSecondary: {
          backgroundColor: '#C8922A',
          color: '#FEFEFE',
          '&:hover': {
            backgroundColor: '#E8B64A',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(10,22,40,0.15)',
          color: '#0A1628',
          '&:hover': {
            backgroundColor: 'rgba(10,22,40,0.03)',
            borderColor: 'rgba(10,22,40,0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontSize: '0.9375rem',
            fontFamily: '"DM Sans", sans-serif',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: 'rgba(10,22,40,0.12)',
              transition: 'border-color 0.2s',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(10,22,40,0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C8922A',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(200,146,42,0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            color: '#64748B',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#C8922A',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(10,22,40,0.06)',
          boxShadow: '0 1px 3px rgba(10,22,40,0.04), 0 1px 2px rgba(10,22,40,0.03)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(10,22,40,0.08), 0 4px 10px rgba(10,22,40,0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(10,22,40,0.04), 0 1px 2px rgba(10,22,40,0.03)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(10,22,40,0.08), 0 2px 6px rgba(10,22,40,0.04)',
        },
        elevation3: {
          boxShadow: '0 10px 40px rgba(10,22,40,0.12), 0 4px 12px rgba(10,22,40,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.8125rem',
          fontWeight: 500,
          height: 30,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(10,22,40,0.04)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(10,22,40,0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
          color: '#64748B',
          borderBottomColor: 'rgba(10,22,40,0.06)',
        },
        body: {
          fontSize: '0.875rem',
          borderBottomColor: 'rgba(10,22,40,0.04)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(200,146,42,0.03)',
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepIcon-root': {
            color: 'rgba(10,22,40,0.1)',
            '&.Mui-active': {
              color: '#0A1628',
            },
            '&.Mui-completed': {
              color: '#C8922A',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.9375rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: '1px solid rgba(10,22,40,0.06)',
          boxShadow: '0 20px 60px rgba(10,22,40,0.15)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#C8922A',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#C8922A',
          },
        },
      },
    },
  },
});

export default theme;
