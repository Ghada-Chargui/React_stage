import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectIfAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const activeUser = localStorage.getItem('confiSitUser');
    if (activeUser) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

export default RedirectIfAuth;
