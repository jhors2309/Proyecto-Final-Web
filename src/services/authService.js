import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export async function registerUser({ nombre, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'usuarios', credential.user.uid), {
    uid: credential.user.uid,
    nombre,
    email,
    rol: 'usuario',
    fechaRegistro: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
