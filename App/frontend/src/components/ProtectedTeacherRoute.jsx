import { Navigate } from 'react-router-dom';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';

export default function ProtectedTeacherRoute({ children }) {
  const { token } = useTeacherAuth();
  if (!token) return <Navigate to="/teacher-login" replace />;
  return children;
}
