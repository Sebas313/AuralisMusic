export const environment = {
  production: true,
  apiUrl: process.env['VITE_API_URL'] || 'https://auralismusic-production.up.railway.app',
  frontendUrl: process.env['FRONTEND_URL'] || 'https://auralis-music.vercel.app'
};