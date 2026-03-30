import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FbPost from "./pages/FbPost";
import IgPost from "./pages/IgPost";
import IgComment from "./pages/IgComment";
import EurobetDashboard from "./pages/EurobetDashboard";
import PennyDashboard from "./pages/PennyDashboard";
import Login from "./login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/eurobet-instagram" element={<ProtectedRoute><EurobetDashboard /></ProtectedRoute>} />
          <Route path="/penny-facebook" element={<ProtectedRoute><PennyDashboard platform="facebook" /></ProtectedRoute>} />
          <Route path="/penny-instagram" element={<ProtectedRoute><PennyDashboard platform="instagram" /></ProtectedRoute>} />
          <Route path="/FbPost" element={<ProtectedRoute><FbPost /></ProtectedRoute>} />
          <Route path="/IgPost" element={<ProtectedRoute><IgPost /></ProtectedRoute>} />
          <Route path="/IgComment" element={<ProtectedRoute><IgComment /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
