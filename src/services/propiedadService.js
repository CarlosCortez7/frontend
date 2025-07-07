import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
export const getPropiedadesFiltradas = async ({ region, provincia, comuna, sector, tipo }) => {
  const snapshot = await getDocs(collection(db, "propiedades"));

  const todas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const filtradas = todas.filter(p => {
    return (
      (!region || p.region === region) &&
      (!provincia || p.provincia === provincia) &&
      (!comuna || p.comuna === comuna) &&
      (!sector || p.sector === sector) &&
      (!tipo || p.tipo === tipo)
    );
  });

  return filtradas;
};
