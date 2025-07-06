function CardPropiedad({ propiedad }) {
  const { titulo, precio, nombre_sector, imagenes } = propiedad;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow">
        <img
          src={imagenes?.[0] || "/sin-imagen.jpg"}
          className="card-img-top"
          alt="Imagen propiedad"
        />
        <div className="card-body">
          <h5 className="card-title">{titulo}</h5>
          <p className="card-text"><strong>Precio:</strong> {precio ? `$${precio}` : 'No disponible'}</p>
          <p className="card-text"><strong>Sector:</strong> {nombre_sector || "Sin sector"}</p>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-primary">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
}

export default CardPropiedad;