import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicarPropiedad from './pages/PublicarPropiedad';
import Login from './pages/Login';

function AppRouter() {
 return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/publicar" element={<PublicarPropiedad />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;