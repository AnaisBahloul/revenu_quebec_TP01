import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';
import DashboardPage from './views/DashboardPage';
import DeclarationPage from './views/DeclarationPage';
import StatusPage from './views/StatusPage';
import HistoryPage from './views/HistoryPage';
import ProfilePage from './views/ProfilePage';
import AvisListPage from './views/AvisListPage';
import AvisPage from './views/AvisPage';
import DeclarationView from './views/DeclarationView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/declaration" element={<DeclarationPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/avis" element={<AvisListPage />} /> {/* liste des avis */}
        <Route path="/avis/:id" element={<AvisPage />} /> {/* détails d'un avis */}
        <Route path="/profile" element={<ProfilePage />} />
         <Route path="/declaration/:id" element={<DeclarationView />} /> {/*détails d'une declaration */}
      </Routes>
    </Router>
  );
}

export default App;
