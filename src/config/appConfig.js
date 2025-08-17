export const cfg = {
  mode: process.env.REACT_APP_APP_MODE === 'internal' ? 'internal' : 'demo',
  brand: process.env.REACT_APP_BRAND || 'Demo',
};
