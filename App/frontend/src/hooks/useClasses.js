import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';

// Read-only list of the logged-in teacher's classes (with studentCount).
export default function useClasses() {
  const { token } = useTeacherAuth();
  const [classes, setClasses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiRequest('/classes', { token })
      .then((data) => { if (!cancelled) setClasses(data.classes); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [token]);

  return { classes, loaded, error };
}
