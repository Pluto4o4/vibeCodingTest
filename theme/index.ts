import { createTheme } from '@mui/material/styles';

// Flow 官网风格配色方案
const theme = createTheme({
  palette: {
    primary: {
      main: '#2D3748', // 深灰色 - 主色
      light: '#4A5568',
      dark: '#1A202C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#38A169', // 温和绿色 - 辅助色
      light: '#68D391',
      dark: '#2F855A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FEFEFE', // 纯净白背景
      paper: '#FFFFFF', // 纯白卡片
    },
    text: {
      primary: '#2D3748', // 深灰文字
      secondary: '#718096',
    },
    divider: '#E2E8F0', // 浅灰分割线
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2D3748',
      fontFamily: 'Caveat, cursive',
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2D3748',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2D3748',
    },
  },
  shape: {
    borderRadius: 16, // Flow 风格圆角
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 1px 3px rgba(0, 0, 0, 0.1)',
    '0 2px 6px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        contained: {
          background: '#2D3748',
          boxShadow: '0 2px 8px rgba(45, 55, 72, 0.15)',
          '&:hover': {
            background: '#1A202C',
            boxShadow: '0 4px 12px rgba(45, 55, 72, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#2D3748',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2D3748',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          border: '1px solid #E2E8F0',
          '&.Mui-selected': {
            backgroundColor: '#2D3748',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#1A202C',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

export default theme;