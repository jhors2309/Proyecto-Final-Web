import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NewIncident from './pages/NewIncident';
import MyIncidents from './pages/MyIncidents';
import IncidentDetail from './pages/IncidentDetail';
import AdminDashboard from './pages/AdminDashboard';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/nuevo-reporte"
            element={
              <ProtectedRoute>
                <NewIncident />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-reportes"
            element={
              <ProtectedRoute>
                <MyIncidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidente/:id"
            element={
              <ProtectedRoute>
                <IncidentDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/estadisticas"
            element={
              <AdminRoute>
                <Stats />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
