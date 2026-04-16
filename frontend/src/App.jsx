import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import MainPage from "./pages/MainPage/MainPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import ObjectivesPage from "./pages/ObjectivesPage/ObjectivesPage.jsx";
import DraftPage from "./pages/DraftPage/DraftPage.jsx";
import StorePage from "./pages/StorePage/StorePage.jsx";
import SBCPage from "./pages/SBCPage/SBCPage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";
import ClubPage from "./pages/ClubPage/ClubPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
          <Route path="/draft" element={<DraftPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/sbc" element={<SBCPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/club" element={<ClubPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
