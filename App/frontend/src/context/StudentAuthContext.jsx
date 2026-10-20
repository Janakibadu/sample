import { createContext, useCallback, useContext, useState } from 'react';

const TOKEN_KEY = 'speak_student_token';
const INFO_KEY = 'speak_student_info';

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [student, setStudent] = useState(() => {
    const raw = localStorage.getItem(INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback((newToken, newStudent) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(INFO_KEY, JSON.stringify(newStudent));
    setToken(newToken);
    setStudent(newStudent);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);
    setToken(null);
    setStudent(null);
  }, []);

  return (
    <StudentAuthContext.Provider value={{ token, student, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error('useStudentAuth must be used within StudentAuthProvider');
  return ctx;
}
