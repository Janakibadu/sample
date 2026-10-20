import { Navigate } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';

export default function ProtectedStudentRoute({ children }) {
  const { token } = useStudentAuth();
  if (!token) return <Navigate to="/student-login" replace />;
  return children;
}
