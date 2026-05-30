# UDLA Reporta

Aplicación web en React + Firebase para registrar y administrar reportes de incidentes dentro de la Universidad de la Amazonia.

## 1. Requisitos previos

Antes de ejecutar el proyecto necesitas instalar:

- Node.js LTS.
- Visual Studio Code.
- Cuenta de Google para Firebase.
- Git y cuenta de GitHub.

## 2. Instalar dependencias

Abre la carpeta del proyecto en Visual Studio Code y ejecuta:

```bash
npm install
```

## 3. Crear proyecto en Firebase

1. Entra a Firebase Console.
2. Clic en "Crear proyecto".
3. Nombre sugerido: `udla-reporta`.
4. Puedes desactivar Google Analytics si quieres hacerlo más sencillo.
5. Crea una app web usando el icono `</>`.
6. Copia la configuración de Firebase.

## 4. Crear archivo .env

Copia el archivo `.env.example`, pégalo en la raíz del proyecto y cámbiale el nombre a `.env`.

Después reemplaza cada valor por los datos reales que te da Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 5. Activar Authentication

En Firebase Console:

1. Entra a Build > Authentication.
2. Clic en "Get started".
3. En "Sign-in method", activa "Email/Password".
4. Guarda los cambios.

## 6. Crear Firestore Database

En Firebase Console:

1. Entra a Build > Firestore Database.
2. Clic en "Create database".
3. Elige modo de producción.
4. Selecciona una región cercana.
5. Cuando se cree, entra a la pestaña Rules.
6. Copia el contenido de `firestore.rules` y publícalo.

## 7. Crear Storage

En Firebase Console:

1. Entra a Build > Storage.
2. Clic en "Get started".
3. Crea el bucket.
4. En la pestaña Rules, copia el contenido de `storage.rules` y publícalo.

## 8. Ejecutar localmente

```bash
npm run dev
```

Abre la URL que aparece en la terminal, normalmente:

```txt
http://localhost:5173
```

## 9. Crear usuario administrador

1. Regístrate desde la aplicación con tu correo.
2. Ve a Firebase Console > Firestore Database > colección `usuarios`.
3. Busca tu usuario.
4. Cambia el campo `rol` de `usuario` a `admin`.
5. Cierra sesión y vuelve a entrar.
6. Ya debe aparecer el menú Admin y Estadísticas.

## 10. Funciones implementadas

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Registro de incidentes.
- Foto obligatoria en Firebase Storage.
- Ubicación manual obligatoria.
- Ubicación GPS opcional.
- Fecha automática.
- Estado inicial: Reportado.
- Listado de reportes del usuario.
- Filtro por estado.
- Vista detalle.
- Panel administrador.
- Cambio de estado.
- Agrupación de incidentes.
- Estadísticas por periodo.
- Total de incidentes.
- Incidentes por estado.
- Incidentes por tipo.
- Botón imprimir.
- Diseño responsive básico.

## 11. Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. Entra a Vercel.
3. Importa el repositorio.
4. En Environment Variables agrega las mismas variables del archivo `.env`.
5. Deploy.
6. Copia el link final.

## 12. Comandos para GitHub

```bash
git init
git add .
git commit -m "Proyecto final UDLA Reporta"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Si ya existe el remote origin:

```bash
git remote -v
git remote set-url origin URL_DE_TU_REPOSITORIO
git push -u origin main
```
