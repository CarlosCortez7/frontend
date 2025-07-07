import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  getRegiones,
  getProvinciasByRegion,
  getComunasByProvincia,
  getSectoresByComuna,
  getTiposPropiedad,
} from "../services/filtroService";

export default function DetallePropiedad() {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [nombres, setNombres] = useState({
    region: "",
    provincia: "",
    comuna: "",
    sector: "",
    tipo: "",
  });

  useEffect(() => {
    async function cargarDatos() {
      const docRef = doc(db, "propiedades", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPropiedad(data);

        const [regiones, provincias, comunas, sectores, tipos] = await Promise.all([
          getRegiones(),
          getProvinciasByRegion(data.region),
          getComunasByProvincia(data.provincia),
          getSectoresByComuna(data.comuna),
          getTiposPropiedad(),
        ]);

        setNombres({
          region: regiones.find((r) => r.id === data.region)?.nombre_region || "Desconocida",
          provincia: provincias.find((p) => p.id === data.provincia)?.nombre_provincia || "Desconocida",
          comuna: comunas.find((c) => c.id === data.comuna)?.nombre_comuna || "Desconocida",
          sector: sectores.find((s) => s.id === data.sector)?.nombre_sector || "Desconocido",
          tipo: tipos.find((t) => t.id === data.tipo)?.tipo || "Desconocido",
        });
      }
    }

    cargarDatos();
  }, [id]);

  if (!propiedad) return <div className="container mt-4">Cargando propiedad...</div>;

  return (
    <div className="container mt-4">
      <h2>{propiedad.titulo}</h2>
      <img src={propiedad.imagenes?.[0] || "/sin-imagen.jpg"} alt="Imagen propiedad" className="img-fluid mb-3" />
      
      <p><strong>Descripción:</strong> {propiedad.descripcion}</p>
      <p><strong>Precio:</strong> ${propiedad.precio}</p>
      <p><strong>Valor UF:</strong> {propiedad.valor_uf}</p>
      <p><strong>Superficie construida:</strong> {propiedad.superficie_construida} m²</p>
      <p><strong>Dormitorios:</strong> {propiedad.cantidad_dormitorios}</p>
      <p><strong>Baños:</strong> {propiedad.cantidad_banos}</p>
      <p><strong>Pisos:</strong> {propiedad.cantidad_pisos}</p>
      <p><strong>Estacionamientos:</strong> {propiedad.estacionamientos}</p>
      <p><strong>Fecha publicación:</strong> {new Date(propiedad.fecha_publicacion?.seconds * 1000).toLocaleDateString()}</p>
      
      <p><strong>Región:</strong> {nombres.region}</p>
      <p><strong>Provincia:</strong> {nombres.provincia}</p>
      <p><strong>Comuna:</strong> {nombres.comuna}</p>
      <p><strong>Sector:</strong> {nombres.sector}</p>
      <p><strong>Tipo de propiedad:</strong> {nombres.tipo}</p>

      <div className="mt-4">
        <a href="/" className="btn btn-secondary">Volver</a>
      </div>
    </div>
  );
}
