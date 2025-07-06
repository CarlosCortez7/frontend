import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRegiones,
  getProvinciasByRegion,
  getComunasByProvincia,
  getSectoresByComuna,
  getTiposPropiedad
} from "../services/filtroService";
import { getPropiedadesFiltradas } from "../services/propiedadService";
import CardPropiedad from "../components/CardPropiedad";

export default function Home() {
  const navigate = useNavigate();
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tiposPropiedad, setTiposPropiedad] = useState([]);

  const [filtros, setFiltros] = useState({
    region: "",
    provincia: "",
    comuna: "",
    sector: "",
    tipo: "",
  });

  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    async function cargarDatosIniciales() {
      const reg = await getRegiones();
      const tipos = await getTiposPropiedad();
      setRegiones(reg);
      setTiposPropiedad(tipos);
    }
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    async function cargarProvincias() {
      if (filtros.region) {
        const prov = await getProvinciasByRegion(filtros.region);
        setProvincias(prov);
      } else {
        setProvincias([]);
      }
      setFiltros((f) => ({ ...f, provincia: "", comuna: "", sector: "" }));
      setComunas([]);
      setSectores([]);
    }
    cargarProvincias();
  }, [filtros.region]);

  useEffect(() => {
    async function cargarComunas() {
      if (filtros.provincia) {
        const com = await getComunasByProvincia(filtros.provincia);
        setComunas(com);
      } else {
        setComunas([]);
      }
      setFiltros((f) => ({ ...f, comuna: "", sector: "" }));
      setSectores([]);
    }
    cargarComunas();
  }, [filtros.provincia]);

  useEffect(() => {
    async function cargarSectores() {
      if (filtros.comuna) {
        const sec = await getSectoresByComuna(filtros.comuna);
        setSectores(sec);
      } else {
        setSectores([]);
      }
      setFiltros((f) => ({ ...f, sector: "" }));
    }
    cargarSectores();
  }, [filtros.comuna]);

  useEffect(() => {
    async function cargarPropiedades() {
      const props = await getPropiedadesFiltradas(filtros);
      setPropiedades(props);
    }
    cargarPropiedades();
  }, [filtros]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFiltros((f) => ({ ...f, [name]: value }));
  }

  return (
    <div className="container mt-4">
      <h1>Propiedades Disponibles</h1>

      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label htmlFor="region" className="form-label">Región</label>
          <select id="region" name="region" className="form-select" value={filtros.region} onChange={handleChange}>
            <option value="">Seleccione Región</option>
            {regiones.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre_region}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="provincia" className="form-label">Provincia</label>
          <select id="provincia" name="provincia" className="form-select" value={filtros.provincia} onChange={handleChange} disabled={!provincias.length}>
            <option value="">Seleccione Provincia</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_provincia}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="comuna" className="form-label">Comuna</label>
          <select id="comuna" name="comuna" className="form-select" value={filtros.comuna} onChange={handleChange} disabled={!comunas.length}>
            <option value="">Seleccione Comuna</option>
            {comunas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre_comuna}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="sector" className="form-label">Sector</label>
          <select id="sector" name="sector" className="form-select" value={filtros.sector} onChange={handleChange} disabled={!sectores.length}>
            <option value="">Seleccione Sector</option>
            {sectores.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre_sector}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="tipo" className="form-label">Tipo de Propiedad</label>
          <select id="tipo" name="tipo" className="form-select" value={filtros.tipo} onChange={handleChange}>
            <option value="">Seleccione Tipo</option>
            {tiposPropiedad.map((t) => (
              <option key={t.id} value={t.id}>{t.tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {propiedades.length === 0 ? (
          <p>No hay propiedades que coincidan con los filtros.</p>
        ) : (
          propiedades.map((prop) => (
            <div key={prop.id} className="col-md-4 mb-4">
              <CardPropiedad propiedad={prop} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
