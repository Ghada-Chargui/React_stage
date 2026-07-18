import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredCurrentUser, normalizeRole } from '../utils/storage';

function RedirectIfAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const parsed = getStoredCurrentUser();
      if (!parsed) return;

      const role = normalizeRole(parsed.role);
      if (role === 'admin') {
        navigate('/espace-admin');
        return;
      }

      if (role === 'babysitter') {
        navigate('/espace-babysitter');
        return;
      }

      navigate('/espace-parent');
    };

    check();

    window.addEventListener('storage', check);
    window.addEventListener('confiSitDataChanged', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('confiSitDataChanged', check);
    };
  }, [navigate]);

  return children;
}

export default RedirectIfAuth;
