import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";

export const getTiposPropiedad = async () => {
  const q = query(collection(db, "tipo_propiedad"), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

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
  const q = query(collection(db, "comunas"), where("idprovincia", "==", idprovincia), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSectoresByComuna = async (idcomuna) => {
  const q = query(collection(db, "sectores"), where("idcomuna", "==", idcomuna), where("estado", "==", 1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSectorById = async (id) => {
  try {
    const ref = doc(db, "sectores", id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().nombre_sector : "Sin sector";
  } catch (error) {
    console.error("Error al obtener nombre del sector:", error);
    return "Sin sector";
  }
};