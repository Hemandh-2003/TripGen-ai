import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import SharePage from "./pages/SharePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import OAuthSuccess from "./pages/OAuthSuccess";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";

function App() {
    return (
        <BrowserRouter>
  <Routes>
    <Route path="/dashboard" element={<ProtectedRoute>  <DashboardPage /> </ProtectedRoute>} />
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/upload"element={<ProtectedRoute> <UploadPage /> </ProtectedRoute>} />
   <Route path="/history" element={<ProtectedRoute> <HistoryPage /> </ProtectedRoute>} />
    <Route path="/share/:shareId" element={<SharePage />} />
    <Route path="/oauth-success" element={<OAuthSuccess />} />
    <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
    <Route path="/ai-recommendations" element={<ProtectedRoute> <AIRecommendationsPage /> </ProtectedRoute>} />
  </Routes>
</BrowserRouter>
    );
}

export default App;
