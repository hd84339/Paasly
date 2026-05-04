import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShopDetail from './pages/ShopDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/shop/:id" element={<ShopDetail />} />
                {/* Fallback */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                  </div>
                } />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
