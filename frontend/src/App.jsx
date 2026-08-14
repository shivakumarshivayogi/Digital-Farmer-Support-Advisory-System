import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/dashboards/FarmerDashboard';
import ExpertDashboard from './pages/dashboards/ExpertDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Phase 3 Pages
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';
import FarmListPage from './pages/farmer/FarmListPage';
import AddFarmPage from './pages/farmer/AddFarmPage';
import EditFarmPage from './pages/farmer/EditFarmPage';
import FarmDetailsPage from './pages/farmer/FarmDetailsPage';

// Phase 4 Pages
import CropListPage from './pages/farmer/CropListPage';
import AddCropPage from './pages/farmer/AddCropPage';
import EditCropPage from './pages/farmer/EditCropPage';
import CropDetailsPage from './pages/farmer/CropDetailsPage';

// Phase 5 Pages
import CropAdvisoryPage from './pages/advisory/CropAdvisoryPage';
import SoilManagementPage from './pages/farmer/SoilManagementPage';
import DiseaseAdvisoryPage from './pages/advisory/DiseaseAdvisoryPage';
import FertilizerAdvisoryPage from './pages/advisory/FertilizerAdvisoryPage';

// Phase 6 Pages
import WeatherPage from './pages/weather/WeatherPage';
import MarketPricesPage from './pages/market/MarketPricesPage';

// Phase 7 Pages
import ExpertListPage from './pages/expert/ExpertListPage';
import ExpertProfilePage from './pages/expert/ExpertProfilePage';
import QuestionListPage from './pages/questions/QuestionListPage';
import AskQuestionPage from './pages/questions/AskQuestionPage';
import QuestionDetailsPage from './pages/questions/QuestionDetailsPage';
import ConsultationListPage from './pages/consultations/ConsultationListPage';

// Phase 8 Pages
import ChatPage from './pages/chat/ChatPage';

// Phase 9 Pages
import SchemeListPage from './pages/schemes/SchemeListPage';
import NotificationPage from './pages/notifications/NotificationPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Role-Based Dashboard Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expert/dashboard"
            element={
              <ProtectedRoute allowedRoles={['expert', 'admin']}>
                <ExpertDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Phase 3 Farmer & Farm Management Routes */}
          <Route
            path="/farmer/profile"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmerProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/farms"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/farms/new"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <AddFarmPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/farms/:id"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/farms/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <EditFarmPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 4 Crop Management Routes */}
          <Route
            path="/farmer/crops"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <CropListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/crops/new"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <AddCropPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/crops/:id"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <CropDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/crops/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <EditCropPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 5 Agriculture Advisory & Soil Routes */}
          <Route path="/advisory/crops" element={<CropAdvisoryPage />} />
          <Route path="/advisory/diseases" element={<DiseaseAdvisoryPage />} />
          <Route path="/advisory/fertilizers" element={<FertilizerAdvisoryPage />} />
          <Route
            path="/farmer/soil-records"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <SoilManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6 Weather & Market Routes */}
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/market" element={<MarketPricesPage />} />

          {/* Phase 7 Expert Consultation & Q&A Routes */}
          <Route path="/experts" element={<ExpertListPage />} />
          <Route path="/experts/:id" element={<ExpertProfilePage />} />
          <Route path="/questions" element={<QuestionListPage />} />
          <Route
            path="/questions/new"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'expert', 'admin']}>
                <AskQuestionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/questions/:id" element={<QuestionDetailsPage />} />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'expert', 'admin']}>
                <ConsultationListPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 8 Real-Time Chat Routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'expert', 'admin']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:recipientId"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'expert', 'admin']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 9 Government Schemes & Notification Routes */}
          <Route path="/schemes" element={<SchemeListPage />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'expert', 'admin']}>
                <NotificationPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
