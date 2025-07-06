import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getPropiedadesFiltradas = async ({ region, provincia, comuna, sector, tipo }) => {
  const q = query(collection(db, "propiedades"));

  const snapshot = await getDocs(q);
  const todas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const filtradas = todas.filter(p => {
    return (
      (!region || p.idregion === region) &&
      (!provincia || p.idprovincias === provincia) &&
      (!comuna || p.idcomunas === comuna) &&
      (!sector || p.idsectores === sector) &&
      (!tipo || p.idtipo === tipo)
    );
  });

  return filtradas;
};
