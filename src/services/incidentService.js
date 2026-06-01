import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';
import { supabase } from '../supabase/supabaseConfig';

const incidentCollection = collection(db, 'incidentes');

function sortByDateDesc(incidents) {
  return incidents.sort((a, b) => {
    const dateA = a.fechaCreacion?.toDate ? a.fechaCreacion.toDate().getTime() : 0;
    const dateB = b.fechaCreacion?.toDate ? b.fechaCreacion.toDate().getTime() : 0;
    return dateB - dateA;
  });
}

export async function createIncident({
  user,
  tipo,
  descripcion,
  ubicacionTexto,
  latitud,
  longitud,
  imageFile,
}) {
  if (!imageFile) {
    throw new Error('La fotografía es obligatoria.');
  }

  const bucketName = 'incidentes';



  const cleanFileName = imageFile.name.replaceAll(' ', '_');
  const imagePath = `${user.uid}/${Date.now()}-${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(imagePath, imageFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: imageFile.type,
    });

  if (uploadError) {
    throw new Error(`No fue posible subir la fotografía: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath);
  const imagenURL = data.publicUrl;

  const docRef = await addDoc(incidentCollection, {
    usuarioId: user.uid,
    usuarioEmail: user.email,
    tipo,
    descripcion,
    imagenURL,
    imagePath,
    ubicacionTexto,
    latitud: latitud || null,
    longitud: longitud || null,
    fechaCreacion: serverTimestamp(),
    estado: 'Reportado',
    grupoId: null,
    actualizadoEn: serverTimestamp(),
  });

  return docRef.id;
}

export async function getIncidentById(id) {
  const incidentRef = doc(db, 'incidentes', id);
  const snapshot = await getDoc(incidentRef);

  if (!snapshot.exists()) {
    throw new Error('El incidente no existe.');
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function getIncidentsByUser(userId, estado = 'Todos') {
  const q = query(incidentCollection, where('usuarioId', '==', userId));
  const snapshot = await getDocs(q);

  let incidents = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  if (estado !== 'Todos') {
    incidents = incidents.filter((incident) => incident.estado === estado);
  }

  return sortByDateDesc(incidents);
}

export async function getAllIncidents(estado = 'Todos') {
  const snapshot = await getDocs(incidentCollection);

  let incidents = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  if (estado !== 'Todos') {
    incidents = incidents.filter((incident) => incident.estado === estado);
  }

  return sortByDateDesc(incidents);
}

export async function updateIncidentStatus(incident, newStatus) {
  if (incident.grupoId) {
    const q = query(incidentCollection, where('grupoId', '==', incident.grupoId));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach((item) => {
      batch.update(item.ref, {
        estado: newStatus,
        actualizadoEn: serverTimestamp(),
      });
    });

    await batch.commit();
    return;
  }

  const incidentRef = doc(db, 'incidentes', incident.id);

  await updateDoc(incidentRef, {
    estado: newStatus,
    actualizadoEn: serverTimestamp(),
  });
}

export async function groupIncidents(incidentIds) {
  if (incidentIds.length < 2) {
    throw new Error('Debes seleccionar mínimo dos incidentes para agrupar.');
  }

  const grupoId = `grupo_${Date.now()}`;
  const batch = writeBatch(db);

  incidentIds.forEach((id) => {
    const incidentRef = doc(db, 'incidentes', id);

    batch.update(incidentRef, {
      grupoId,
      actualizadoEn: serverTimestamp(),
    });
  });

  await batch.commit();

  return grupoId;
}