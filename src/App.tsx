import './App.css'
import { AuthProvider } from "./context/AuthContext";
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from './pages/SearchPage';


function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dogs" element={<SearchPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
