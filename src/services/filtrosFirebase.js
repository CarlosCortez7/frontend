import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getRegiones = async () => {
  const q = query(collection(db, "regiones"), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProvinciasByRegion = async (idregion) => {
  const q = query(collection(db, "provincias"), where("idregion", "==", idregion), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getComunasByProvincia = async (idprovincia) => {
  const q = query(collection(db, "comunas"), where("idprovincias", "==", idprovincia), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSectoresByComuna = async (idcomuna) => {
  const q = query(collection(db, "sectores"), where("idcomunas", "==", idcomuna), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
