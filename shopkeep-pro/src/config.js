// Master Configuration for ShopKeep Pro
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : window.location.hostname.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/)
      ? `http://${window.location.hostname}:5000/api` 
      : '/api'); 

console.log("Connected to API at:", API_BASE_URL);
