import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicarPropiedad from './pages/PublicarPropiedad';
import Login from './pages/Login';
import DetallePropiedad from './pages/DetallePropiedad';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/publicar" element={<PublicarPropiedad />} />
      <Route path="/login" element={<Login />} />
      <Route path="/detalle/:id" element={<DetallePropiedad />} />
    </Routes>
  );
}


export default AppRouter;