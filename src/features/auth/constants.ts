export const ROUTES = {
  LOGIN: {
    path: '/login',
    label: 'Login',
  },
  REGISTER: {
    path: '/register',
    label: 'Register',
  },
  FORGOT_PASSWORD: {
    path: '/forgot-password',
    label: 'Forgot Password',
  },
  RESET_PASSWORD: {
    path: '/reset-password',
    label: 'Reset Password',
  },
  DASHBOARD: {
    path: '/dashboard',
    label: 'Dashboard',
  },
  TRADING_JOURNAL: {
    path: '/trading-journal',
    label: 'Trading Journal',
  },
};

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];
