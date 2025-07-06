import { useState, useEffect } from 'react';
import { getRegiones, getProvinciasByRegion, getComunasByProvincia, getSectoresByComuna } from '../services/filtrosService';

function Filtros() {
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sectores, setSectores] = useState([]);

  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');

  useEffect(() => {
    getRegiones().then(data => setRegiones(data));
  }, []);

  useEffect(() => {
    if (regionSeleccionada) {
      getProvinciasByRegion(regionSeleccionada).then(data => setProvincias(data));
      setComunas([]);
      setSectores([]);
      setProvinciaSeleccionada('');
      setComunaSeleccionada('');
    } else {
      setProvincias([]);
      setComunas([]);
      setSectores([]);
      setProvinciaSeleccionada('');
      setComunaSeleccionada('');
    }
  }, [regionSeleccionada]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      getComunasByProvincia(provinciaSeleccionada).then(data => setComunas(data));
      setSectores([]);
      setComunaSeleccionada('');
    } else {
      setComunas([]);
      setSectores([]);
      setComunaSeleccionada('');
    }
  }, [provinciaSeleccionada]);

  useEffect(() => {
    if (comunaSeleccionada) {
      getSectoresByComuna(comunaSeleccionada).then(data => setSectores(data));
    } else {
      setSectores([]);
    }
  }, [comunaSeleccionada]);

  return (
    <>
      <select value={regionSeleccionada} onChange={e => setRegionSeleccionada(e.target.value)}>
        <option value="">Seleccionar Región</option>
        {regiones.map(r => (
          <option key={r.id} value={r.id}>{r.nombre_region}</option>
        ))}
      </select>

      <select 
        value={provinciaSeleccionada} 
        onChange={e => setProvinciaSeleccionada(e.target.value)}
        disabled={!provincias.length}
      >
        <option value="">Seleccionar Provincia</option>
        {provincias.map(p => (
          <option key={p.id} value={p.id}>{p.nombre_provincia}</option>
        ))}
      </select>

      <select 
        value={comunaSeleccionada} 
        onChange={e => setComunaSeleccionada(e.target.value)}
        disabled={!comunas.length}
      >
        <option value="">Seleccionar Comuna</option>
        {comunas.map(c => (
          <option key={c.id} value={c.id}>{c.nombre_comuna}</option>
        ))}
      </select>

      <select disabled={!sectores.length}>
        <option value="">Seleccionar Sector</option>
        {sectores.map(s => (
          <option key={s.id} value={s.id}>{s.nombre_sector}</option>
        ))}
      </select>
    </>
  );
}
