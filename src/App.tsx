import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Auth
import LoginPage from './pages/login/Login';
import { configureAuthInterceptors } from './apis/axios';
import authApi from './apis/auth';
import { useAuthStore } from './store/authStore';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FarmerLayout from './layouts/FarmerLayout';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

// Farmer pages
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerGardens from './pages/farmer/Gardens';
import FarmerRealPlants from './pages/farmer/RealPlants';
import CreatePlantUpdate from './pages/farmer/CreatePlantUpdate';
import PlantTimeline from './pages/farmer/PlantTimeline';
import GardenDetail from './pages/farmer/GardenDetail';
import FarmerPlantUpdates from './pages/farmer/PlantUpdates';

// Shared pages
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminGardens from './pages/admin/Gardens';
import AdminFlowerTypes from './pages/admin/FlowerTypes';
import AdminCareTasks from './pages/admin/CareTasks';
import AdminPlantUpdates from './pages/admin/PlantUpdates';
import AdminVirtualPlants from './pages/admin/VirtualPlants';
import AdminRealPlants from './pages/admin/RealPlants';
import AdminCommunity from './pages/admin/Community';

const antdTheme = {
  token: {
    colorPrimary: '#2ea82e',
    colorLink: '#2ea82e',
    colorSuccess: '#4ab84a',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

function App() {
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    configureAuthInterceptors({
      refreshAccessToken: () => authApi.refreshToken(),
      onAuthFailure: () => {
        logout();
        window.location.href = '/login';
      },
    });
  }, [logout]);

  return (
    <ConfigProvider locale={viVN} theme={antdTheme}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Farmer routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="gardens" element={<FarmerGardens />} />
          <Route path="gardens/:id" element={<GardenDetail />} />
          <Route path="real-plants" element={<FarmerRealPlants />} />
          <Route path="real-plants/:id" element={<PlantTimeline />} />
          <Route path="plant-updates/create/:realPlantId" element={<CreatePlantUpdate />} />
          <Route path="plant-updates" element={<FarmerPlantUpdates />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="farmers" element={<AdminUsers />} />
          <Route path="gardens" element={<AdminGardens />} />
          <Route path="gardens/:id" element={<GardenDetail />} />
          <Route path="real-plants" element={<AdminRealPlants />} />
          <Route path="flower-types" element={<AdminFlowerTypes />} />
          <Route path="care-tasks" element={<AdminCareTasks />} />
          <Route path="plant-updates" element={<AdminPlantUpdates />} />
          <Route path="virtual-plants" element={<AdminVirtualPlants />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
