import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";
import {
  getRegiones,
  getProvinciasByRegion,
  getComunasByProvincia,
  getSectoresByComuna,
  getTiposPropiedad,
} from "../services/filtroService";

export default function PublicarPropiedad() {
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    region: "",
    provincia: "",
    comuna: "",
    sector: "",
    tipo: "",
    superficie_construida: "",
    cantidad_dormitorios: "",
    cantidad_banos: "",
    piscina: false,
    estacionamientos: "",
  });

  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subiendo, setSubiendo] = useState(false);

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
      setForm(f => ({ ...f, provincia: "", comuna: "", sector: "" }));
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
      setForm(f => ({ ...f, comuna: "", sector: "" }));
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
      setForm(f => ({ ...f, sector: "" }));
    }
    cargarSectores();
  }, [form.comuna]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleFileChange(e) {
    setImagenesFiles(Array.from(e.target.files));
  }

  async function subirImagenes() {
    const urls = [];
    setSubiendo(true);
    for (let i = 0; i < imagenesFiles.length; i++) {
      const file = imagenesFiles[i];
      const storageRef = ref(storage, `propiedades/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progreso.toFixed(0));
          },
          error => {
            alert("Error al subir imagen: " + error.message);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            resolve();
          }
        );
      });
    }
    setSubiendo(false);
    setUploadProgress(0);
    return urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (imagenesFiles.length === 0) {
      alert("Debe seleccionar al menos una imagen.");
      return;
    }

    try {
      const urls = await subirImagenes();

      await addDoc(collection(db, "propiedades"), {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        idregion: form.region,
        idprovincias: form.provincia,
        idcomunas: form.comuna,
        idsectores: form.sector,
        idtipo: form.tipo,
        superficie_construida: Number(form.superficie_construida),
        cantidad_dormitorios: Number(form.cantidad_dormitorios),
        cantidad_banos: Number(form.cantidad_banos),
        piscina: form.piscina,
        estacionamientos: Number(form.estacionamientos),
        imagenes: urls,
        fecha_publicacion: new Date(),
      });

      alert("Propiedad publicada con éxito!");
      setForm({
        titulo: "",
        descripcion: "",
        precio: "",
        region: "",
        provincia: "",
        comuna: "",
        sector: "",
        tipo: "",
        superficie_construida: "",
        cantidad_dormitorios: "",
        cantidad_banos: "",
        piscina: false,
        estacionamientos: "",
      });
      setImagenesFiles([]);
    } catch (error) {
      alert("Error al publicar la propiedad: " + error.message);
    }
  }

  return (
    <div className="container mt-4">
      <h2>Publicar Propiedad</h2>
      <form onSubmit={handleSubmit}>
        {}
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

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>

        {}
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

        {}
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

        {}
        <div className="mb-3">
          <label className="form-label">Superficie Construida (m²)</label>
          <input
            type="number"
            name="superficie_construida"
            className="form-control"
            value={form.superficie_construida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de Dormitorios</label>
          <input
            type="number"
            name="cantidad_dormitorios"
            className="form-control"
            value={form.cantidad_dormitorios}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de Baños</label>
          <input
            type="number"
            name="cantidad_banos"
            className="form-control"
            value={form.cantidad_banos}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">
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

        <div className="mb-3">
          <label className="form-label">Estacionamientos</label>
          <input
            type="number"
            name="estacionamientos"
            className="form-control"
            value={form.estacionamientos}
            onChange={handleChange}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label">Imágenes (puede seleccionar varias)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleFileChange}
            disabled={subiendo}
            required
          />
          {subiendo && (
            <div className="mt-2">
              <small>Subiendo imágenes: {uploadProgress}%</small>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={subiendo}>
          {subiendo ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}