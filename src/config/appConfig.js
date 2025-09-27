const cfg = {
    isDemo: process.env.REACT_APP_APP_MODE !== 'internal',
    brand: process.env.REACT_APP_BRAND || 'Demo',
  };
  
  export default cfg;