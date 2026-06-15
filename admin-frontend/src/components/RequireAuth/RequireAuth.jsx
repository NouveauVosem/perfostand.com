import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner/Spinner';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Загрузка…" />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
