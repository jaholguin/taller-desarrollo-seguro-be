
# Backend Seguro - Taller de Desarrollo Seguro

Este proyecto es una API RESTful desarrollada en Node.js y TypeScript como parte del módulo **Taller de Desarrollo Seguro de Software**. Tiene como objetivo implementar buenas prácticas de seguridad en el desarrollo de una aplicación backend básica que gestiona notas de usuarios autenticados.

## 🛡️ Funcionalidades principales

- Registro y autenticación de usuarios con JWT y bcrypt
- Protección de rutas mediante middleware de autenticación
- CRUD de notas personales por usuario autenticado
- Conexión a base de datos PostgreSQL
- Variables de entorno con `dotenv`
- Políticas CORS configuradas para frontend seguro
- Análisis de vulnerabilidades con herramientas como `snyk` y `npm audit`

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL**
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **dotenv** para gestión de variables de entorno
- **CORS** configurado explícitamente

---

## 📂 Estructura del proyecto

```
src/
├── db.ts                # Conexión a PostgreSQL
├── index.ts             # Punto de entrada de la aplicación
├── middleware/
│   └── auth.ts          # Middleware de autenticación JWT
└── routes/
    └── notes.ts         # Rutas protegidas para gestión de notas
```

---

## 🔒 Buenas prácticas de seguridad implementadas

- Hashing seguro de contraseñas con `bcrypt`
- Almacenamiento seguro de secretos y credenciales con `dotenv`
- Verificación de tokens JWT en rutas protegidas
- Prevención de ataques por CORS restringiendo el origen
- Evaluación de dependencias con `snyk` y `npm audit`

---

## 🛠️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/taller-desarrollo-seguro-be.git
   cd taller-desarrollo-seguro-be
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env` con las siguientes variables:
   ```
   DATABASE_URL=postgresql://usuario:password@localhost:5432/mi_base
   JWT_SECRET=una_clave_secreta_segura
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npx ts-node-dev src/index.ts
   ```

---

## 📬 Endpoints principales

- `POST /api/register` - Registro de usuario
- `POST /api/login` - Autenticación y generación de token
- `GET /api/notes` - Obtener notas del usuario autenticado
- `POST /api/notes` - Crear nueva nota
- `DELETE /api/notes/:id` - Eliminar nota

> Todas las rutas `/api/notes` están protegidas por JWT

---

## ✅ Comandos útiles

- Verificar dependencias vulnerables:
  ```bash
  npm audit
  ```
- Revisar seguridad con Snyk (requiere cuenta):
  ```bash
  snyk test
  ```

---

## 📄 Licencia

Este proyecto se entrega como parte del curso académico y está bajo la licencia ISC para fines educativos.
