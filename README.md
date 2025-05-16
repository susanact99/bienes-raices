# 🏠 Bienes Raíces

Aplicación web para la gestión de propiedades inmobiliarias desarrollada con **Node.js**, **Express**, **Sequelize** y **TailwindCSS**, siguiendo la arquitectura **MVC** y utilizando el motor de plantillas **Pug**.

## 📌 Características

- Arquitectura **MVC**
- Autenticación de usuarios con **JWT**
- Protección de formularios mediante **CSRF**
- Subida de imágenes con **Multer**
- Envío de correos con **Nodemailer**
- Vistas dinámicas con **Pug**
- Base de datos **MySQL** gestionada con **Sequelize**
- Estilos modernos con **TailwindCSS**
- Empaquetado de scripts con **Webpack**

---

## 📁 Estructura del Proyecto

```
.
├── public/                # Archivos estáticos (CSS, JS, imágenes)
├── seed/                  # Scripts para poblar o vaciar la base de datos
├── views/                 # Vistas Pug
├── models/                # Modelos de datos Sequelize
├── controllers/           # Lógica de negocio
├── routes/                # Rutas Express
├── middleware/            # Funciones intermedias personalizadas
├── index.js               # Punto de entrada de la aplicación
└── .env                   # Variables de entorno (no se sube al repo)
```

---

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/bienes-raices.git
cd bienes-raices
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura tus variables de entorno creando un archivo `.env` en la raíz:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bienes_raices
JWT_SECRET=una_clave_secreta
EMAIL_USER=tu_correo
EMAIL_PASS=tu_contraseña
```

4. Importa los datos de prueba (opcional):

```bash
npm run db:import
```

---

## 🧪 Scripts disponibles

| Script               | Descripción                                       |
|----------------------|---------------------------------------------------|
| `npm start`          | Inicia la app en modo producción                  |
| `npm run server`     | Inicia el servidor con **Nodemon**                |
| `npm run dev`        | Ejecuta compilación en tiempo real (Tailwind + JS) |
| `npm run css`        | Compila los estilos de **TailwindCSS**           |
| `npm run js`         | Empaqueta los scripts con **Webpack**            |
| `npm run db:import`  | Importa datos de ejemplo a la base de datos      |
| `npm run db:delete`  | Elimina todos los datos de la base de datos      |

---

## 🛠️ Tecnologías usadas

- Node.js
- Express
- Sequelize
- MySQL
- Pug
- TailwindCSS
- Webpack
- JWT
- CSURF
- Multer
- Nodemailer

# bienes-raices
