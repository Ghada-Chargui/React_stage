import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
  const location = useLocation();
  const storedUser = localStorage.getItem('confiSitUser');

  if (!storedUser) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(storedUser);
    const normalizedRole = user.role === 'baby-sitter' ? 'babysitter' : user.role;
    if (requiredRole && normalizedRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/connexion" replace />;
  }

  return children;
}

export default PrivateRoute;
