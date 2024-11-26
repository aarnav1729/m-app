// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import AdminSummary from './components/Admin/SummaryPage';
import MaintenanceHeadPlan from './components/MaintenanceHead/PlanPage';
import MaintenanceHeadDate from './components/MaintenanceHead/DatePage';
import MaintenanceHeadDeviations from './components/MaintenanceHead/DeviationsPage';
import ManagerAssign from './components/Manager/AssignPage';
import ManagerPending from './components/Manager/PendingPage';
import ManagerApprove from './components/Manager/ApprovePage';
import EngineerTasks from './components/Engineer/TasksPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/summary" element={<AdminSummary />} />

          {/* Maintenance Head Routes */}
          <Route path="/maintenance-head/plan" element={<MaintenanceHeadPlan />} />
          <Route path="/maintenance-head/date" element={<MaintenanceHeadDate />} />
          <Route path="/maintenance-head/deviations" element={<MaintenanceHeadDeviations />} />

          {/* Manager Routes */}
          <Route path="/manager/assign" element={<ManagerAssign />} />
          <Route path="/manager/pending" element={<ManagerPending />} />
          <Route path="/manager/approve" element={<ManagerApprove />} />

          {/* Engineer Routes */}
          <Route path="/engineer/tasks" element={<EngineerTasks />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;