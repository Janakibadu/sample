import { Route, Routes } from 'react-router-dom';
import { TeacherAuthProvider } from './context/TeacherAuthContext.jsx';
import { StudentAuthProvider } from './context/StudentAuthContext.jsx';
import { I18nProvider } from './i18n/I18nContext.jsx';
import FunderBar from './components/FunderBar.jsx';
import ProtectedTeacherRoute from './components/ProtectedTeacherRoute.jsx';
import ProtectedStudentRoute from './components/ProtectedStudentRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import TeacherLoginPage from './pages/TeacherLoginPage.jsx';
import TeacherRegisterPage from './pages/TeacherRegisterPage.jsx';
import TeacherForgotPasswordPage from './pages/TeacherForgotPasswordPage.jsx';
import TeacherResetPasswordPage from './pages/TeacherResetPasswordPage.jsx';
import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';
import ClassManagementPage from './pages/ClassManagementPage.jsx';
import AssignmentPage from './pages/AssignmentPage.jsx';
import ContentImportPage from './pages/ContentImportPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import StudentLoginPage from './pages/StudentLoginPage.jsx';
import StudentHomePage from './pages/StudentHomePage.jsx';
import ModulePlayerPage from './pages/ModulePlayerPage.jsx';
import RewardPage from './pages/RewardPage.jsx';
import {
  AudioChoiceTaskPage,
  AudioToImageTaskPage,
  GrammarTaskPage,
  MemoryTaskPage,
  StorybookTaskPage,
} from './pages/TaskPages.jsx';

const teacherRoutes = [
  ['/teacher-dashboard', TeacherDashboardPage],
  ['/class-management', ClassManagementPage],
  ['/assignments', AssignmentPage],
  ['/content-import', ContentImportPage],
  ['/results', ResultsPage],
];

const studentRoutes = [
  ['/student-home', StudentHomePage],
  ['/module/:unitId', ModulePlayerPage],
  ['/task/storybook', StorybookTaskPage],
  ['/task/audio-image', AudioToImageTaskPage],
  ['/task/audio-choice', AudioChoiceTaskPage],
  ['/task/grammar', GrammarTaskPage],
  ['/task/memory', MemoryTaskPage],
  ['/reward', RewardPage],
];

export default function App() {
  return (
    <I18nProvider>
      <TeacherAuthProvider>
        <StudentAuthProvider>
          <FunderBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacher-login" element={<TeacherLoginPage />} />
            <Route path="/teacher-register" element={<TeacherRegisterPage />} />
            <Route path="/teacher-forgot-password" element={<TeacherForgotPasswordPage />} />
            <Route path="/teacher-reset-password" element={<TeacherResetPasswordPage />} />
            <Route path="/student-login" element={<StudentLoginPage />} />
            {teacherRoutes.map(([path, Page]) => (
              <Route key={path} path={path} element={<ProtectedTeacherRoute><Page /></ProtectedTeacherRoute>} />
            ))}
            {studentRoutes.map(([path, Page]) => (
              <Route key={path} path={path} element={<ProtectedStudentRoute><Page /></ProtectedStudentRoute>} />
            ))}
          </Routes>
        </StudentAuthProvider>
      </TeacherAuthProvider>
    </I18nProvider>
  );
}
