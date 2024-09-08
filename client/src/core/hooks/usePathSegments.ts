import { useLocation } from 'react-router-dom';

export const usePathSegments = () => {
  const location = useLocation();
  const path = location.pathname;

  return path
    .replace(/^\/|\/$/g, '')
    .split('/')
    .filter(Boolean);
};