import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectIfAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const activeUser = localStorage.getItem('confiSitUser');
      if (activeUser) navigate('/');
    };

    check();

    // React to login/logout in other tabs/windows
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, [navigate]);


  return children;
}

export default RedirectIfAuth;
