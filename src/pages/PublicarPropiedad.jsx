import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  getRegiones,
  getProvinciasByRegion,
  getComunasByProvincia,
  getSectoresByComuna,
  getTiposPropiedad,
} from "../services/filtroService";

export default function PublicarPropiedad() {
  const [uploadcareReady, setUploadcareReady] = useState(false);

  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    valor_uf: "",
    region: "",
    provincia: "",
    comuna: "",
    sector: "",
    tipo: "",
    superficie_construida: "",
    cantidad_dormitorios: "",
    cantidad_banos: "",
    cantidad_pisos: "",
    piscina: false,
    quincho: false,
    jardin: false,
    estacionamientos: "",
    fecha_publicacion: "",
    imagenes: [],
  });

  //carga script de Uploadcare
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
    script.async = true;
    script.onload = () => {
      window.UPLOADCARE_PUBLIC_KEY = "d6568973a0dbc3595f19";
      setUploadcareReady(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      setRegiones(await getRegiones());
      setTipos(await getTiposPropiedad());
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    async function cargarProvincias() {
      if (form.region) {
        setProvincias(await getProvinciasByRegion(form.region));
      } else {
        setProvincias([]);
      }
      setForm((f) => ({ ...f, provincia: "", comuna: "", sector: "" }));
      setComunas([]);
      setSectores([]);
    }
    cargarProvincias();
  }, [form.region]);

  useEffect(() => {
    async function cargarComunas() {
      if (form.provincia) {
        setComunas(await getComunasByProvincia(form.provincia));
      } else {
        setComunas([]);
      }
      setForm((f) => ({ ...f, comuna: "", sector: "" }));
      setSectores([]);
    }
    cargarComunas();
  }, [form.provincia]);

  useEffect(() => {
    async function cargarSectores() {
      if (form.comuna) {
        setSectores(await getSectoresByComuna(form.comuna));
      } else {
        setSectores([]);
      }
      setForm((f) => ({ ...f, sector: "" }));
    }
    cargarSectores();
  }, [form.comuna]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openUploadWidget = () => {
    if (!uploadcareReady || !window.uploadcare) {
      alert("El widget aún no está listo.");
      return;
    }

    const dialog = window.uploadcare.openDialog(null, {
      publicKey: "d6568973a0dbc3595f19",
      multiple: true,
      imagesOnly: true,
    });

    dialog.done((fileGroup) => {
      fileGroup.files().forEach((filePromise) => {
        filePromise.done((fileInfo) => {
          const url = fileInfo.cdnUrl;
          setForm((prev) => ({
            ...prev,
            imagenes: [...prev.imagenes, url],
          }));
        });
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.titulo.trim().length < 3)
      return alert("El título debe tener al menos 3 caracteres.");
    if (form.descripcion.trim().length < 10)
      return alert("La descripción debe tener al menos 10 caracteres.");
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0)
      return alert("El precio debe ser un número positivo.");
    if (!form.valor_uf || isNaN(form.valor_uf) || Number(form.valor_uf) <= 0)
      return alert("El valor en UF debe ser un número positivo.");
    if (!form.superficie_construida || isNaN(form.superficie_construida) || Number(form.superficie_construida) <= 0)
      return alert("La superficie construida debe ser positiva.");
    if (form.cantidad_dormitorios === "" || isNaN(form.cantidad_dormitorios) || Number(form.cantidad_dormitorios) < 0)
      return alert("Los dormitorios deben ser un número positivo o cero.");
    if (form.cantidad_banos === "" || isNaN(form.cantidad_banos) || Number(form.cantidad_banos) < 0)
      return alert("Los baños deben ser un número positivo o cero.");
    if (form.estacionamientos === "" || isNaN(form.estacionamientos) || Number(form.estacionamientos) < 0)
      return alert("Los estacionamientos deben ser un número positivo o cero.");
    if (form.cantidad_pisos === "" || isNaN(form.cantidad_pisos) || Number(form.cantidad_pisos) < 0)
      return alert("La cantidad de pisos debe ser un número positivo o cero.");
    if (!form.region || !form.provincia || !form.comuna || !form.sector)
      return alert("Debes seleccionar región, provincia, comuna y sector.");
    if (!form.tipo) return alert("Selecciona un tipo de propiedad.");
    
    if (form.fecha_publicacion) {
      const fechaPublicacion = new Date(form.fecha_publicacion);
      const hoy = new Date();
      
      if (fechaPublicacion > hoy) {
        return alert("La fecha de publicación no puede ser en el futuro.");
      }
    }
    
    if (form.imagenes.length === 0) {
      const continuar = confirm("¿Deseas continuar sin imágenes?");
      if (!continuar) return;
    }

    try {
      await addDoc(collection(db, "propiedades"), {
        ...form,
        precio: Number(form.precio),
        valor_uf: Number(form.valor_uf),
        superficie_construida: Number(form.superficie_construida),
        cantidad_dormitorios: Number(form.cantidad_dormitorios),
        cantidad_banos: Number(form.cantidad_banos),
        cantidad_pisos: Number(form.cantidad_pisos),
        estacionamientos: Number(form.estacionamientos),
        fecha_publicacion: form.fecha_publicacion ? new Date(form.fecha_publicacion) : new Date(),
      });

      alert("Propiedad publicada con éxito!");

      setForm({
        titulo: "",
        descripcion: "",
        precio: "",
        valor_uf: "",
        region: "",
        provincia: "",
        comuna: "",
        sector: "",
        tipo: "",
        superficie_construida: "",
        cantidad_dormitorios: "",
        cantidad_banos: "",
        cantidad_pisos: "",
        piscina: false,
        quincho: false,
        jardin: false,
        estacionamientos: "",
        fecha_publicacion: "",
        imagenes: [],
      });
    } catch (err) {
      alert("Error al publicar la propiedad: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Publicar Propiedad</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            className="form-control"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Precio (CLP)</label>
            <input
              type="number"
              name="precio"
              className="form-control"
              value={form.precio}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Valor en UF</label>
            <input
              type="number"
              name="valor_uf"
              className="form-control"
              value={form.valor_uf}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">Región</label>
            <select
              name="region"
              className="form-select"
              value={form.region}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione Región</option>
              {regiones.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre_region}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Provincia</label>
            <select
              name="provincia"
              className="form-select"
              value={form.provincia}
              onChange={handleChange}
              disabled={!provincias.length}
              required
            >
              <option value="">Seleccione Provincia</option>
              {provincias.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_provincia}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Comuna</label>
            <select
              name="comuna"
              className="form-select"
              value={form.comuna}
              onChange={handleChange}
              disabled={!comunas.length}
              required
            >
              <option value="">Seleccione Comuna</option>
              {comunas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_comuna}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Sector</label>
            <select
              name="sector"
              className="form-select"
              value={form.sector}
              onChange={handleChange}
              disabled={!sectores.length}
              required
            >
              <option value="">Seleccione Sector</option>
              {sectores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre_sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Propiedad</label>
          <select
            name="tipo"
            className="form-select"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione Tipo</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Superficie Construida (m²)</label>
          <input
            type="number"
            name="superficie_construida"
            className="form-control"
            value={form.superficie_construida}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Cantidad de Dormitorios</label>
            <input
              type="number"
              name="cantidad_dormitorios"
              className="form-control"
              value={form.cantidad_dormitorios}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cantidad de Baños</label>
            <input
              type="number"
              name="cantidad_banos"
              className="form-control"
              value={form.cantidad_banos}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de Pisos</label>
          <input
            type="number"
            name="cantidad_pisos"
            className="form-control"
            value={form.cantidad_pisos}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Publicación</label>
          <input
            type="date"
            name="fecha_publicacion"
            className="form-control"
            value={form.fecha_publicacion}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="piscina"
                className="form-check-input"
                checked={form.piscina}
                onChange={handleChange}
                id="piscinaCheck"
              />
              <label className="form-check-label" htmlFor="piscinaCheck">
                Piscina
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="quincho"
                className="form-check-input"
                checked={form.quincho}
                onChange={handleChange}
                id="quinchoCheck"
              />
              <label className="form-check-label" htmlFor="quinchoCheck">
                Quincho
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="jardin"
                className="form-check-input"
                checked={form.jardin}
                onChange={handleChange}
                id="jardinCheck"
              />
              <label className="form-check-label" htmlFor="jardinCheck">
                Jardín
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Estacionamientos</label>
          <input
            type="number"
            name="estacionamientos"
            className="form-control"
            value={form.estacionamientos}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imágenes</label>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={openUploadWidget}
            disabled={!uploadcareReady}
          >
            Subir imágenes
          </button>
          {form.imagenes.length > 0 && (
            <div className="mt-2 d-flex flex-wrap">
              {form.imagenes.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`img-${i}`}
                  className="me-2 mb-2"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Publicar
        </button>
      </form>
    </div>
  );
}