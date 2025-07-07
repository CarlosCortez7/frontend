import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSectorById } from "../services/filtroService"; // Asegúrate que esta función exista

function CardPropiedad({ propiedad }) {
  const navigate = useNavigate();
  const { id, titulo, precio, sector, imagenes, nombre_sector } = propiedad;

  const [nombreSector, setNombreSector] = useState(nombre_sector || "Cargando...");

  useEffect(() => {
    async function cargarNombreSector() {
      // Si no viene nombre_sector, se busca desde Firebase
      if (!nombre_sector && sector) {
        const nombre = await getSectorById(sector);
        setNombreSector(nombre || "Sin sector");
      } else if (!sector) {
        setNombreSector("Sin sector");
      }
    }
    cargarNombreSector();
  }, [sector, nombre_sector]);

  const irADetalle = () => {
    navigate(`/detalle/${id}`);
  };

  return (
    <div className="col property-card">
      <div className="card h-100 shadow">
        <img
          src={imagenes?.[0] || "/sin-imagen.jpg"}
          className="card-img-top"
          alt="Imagen propiedad"
        />
        <div className="card-body">
          <h5 className="card-title">{titulo}</h5>

          <p className="card-text d-flex justify-content-between">
            <strong>Precio:</strong>
            <span>${Number(precio).toLocaleString("es-CL")}</span>
          </p>

          <p className="card-text d-flex justify-content-between">
            <strong>Sector:</strong>
            <span>{nombreSector}</span>
          </p>
        </div>

        <div className="card-footer text-center">
          <button className="btn btn-primary" onClick={irADetalle}>
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardPropiedad;
