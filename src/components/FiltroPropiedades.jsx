import { useEffect, useState } from "react";
import { getRegiones, getProvinciasByRegion, getComunasByProvincia, getSectoresByComuna } from "../services/filtrosFirebase";

export default function FiltroPropiedades({ onFiltro }) {
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sectores, setSectores] = useState([]);

  const [idRegion, setIdRegion] = useState("");
  const [idProvincia, setIdProvincia] = useState("");
  const [idComuna, setIdComuna] = useState("");

  useEffect(() => {
    getRegiones().then(setRegiones);
  }, []);

  const handleRegionChange = async (e) => {
    const id = e.target.value;
    setIdRegion(id);
    setIdProvincia("");
    setIdComuna("");
    setSectores([]);
    const data = await getProvinciasByRegion(id);
    setProvincias(data);
  };

  const handleProvinciaChange = async (e) => {
    const id = e.target.value;
    setIdProvincia(id);
    setIdComuna("");
    setSectores([]);
    const data = await getComunasByProvincia(id);
    setComunas(data);
  };

  const handleComunaChange = async (e) => {
    const id = e.target.value;
    setIdComuna(id);
    const data = await getSectoresByComuna(id);
    setSectores(data);
  };

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <label className="form-label">Regiones</label>
        <select className="form-select" onChange={handleRegionChange}>
          <option value="">Seleccionar</option>
          {regiones.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Provincias</label>
        <select className="form-select" onChange={handleProvinciaChange} disabled={!provincias.length}>
          <option value="">Seleccionar</option>
          {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Comunas</label>
        <select className="form-select" onChange={handleComunaChange} disabled={!comunas.length}>
          <option value="">Seleccionar</option>
          {comunas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Sectores</label>
        <select className="form-select" onChange={(e) => onFiltro(e.target.value)} disabled={!sectores.length}>
          <option value="">Seleccionar</option>
          {sectores.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
      </div>
    </div>
  );
}
