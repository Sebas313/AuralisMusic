# Auralis Music
https://res.cloudinary.com/dbt58u6ag/image/upload/v1740601259/uploads/zwutfwchdyr0qxo0b9vv.png
![Foto perfil de AuralisMusic](https://res.cloudinary.com/dbt58u6ag/image/upload/v1740601259/uploads/zwutfwchdyr0qxo0b9vv.png)
## Tecnologías Seleccionadas

### Frontend:
- **Framework:** Angular
- **Estilización:** Tailwind CSS
- **Librerías adicionales:** Howler.js

### Backend:
- **Framework:** Node.js con Express
- **Base de Datos:** MongoDB
- **Autenticación:** jsonwebtoken
- **API:** RESTful
- **Librerías adicionales:** cors, dotenv, uuid, nodemailer, jest, coverage, supertest

### Infraestructura:
- **Despliegue:** Railway y Vercel
- **Repositorios:** GitHub (metodología GitFlow)
- **Servicios externos:** Multer

## Diagrama General de Arquitectura
![Diagrama de arquitectura](https://res.cloudinary.com/dbt58u6ag/image/upload/v1740796791/uploads/bhtigarzsmlismackwqy.png)

### Descripción:

#### Frontend:
- Realiza solicitudes a la API REST.
- Envía peticiones HTTP al backend, especificando los datos que necesita (por ejemplo, una lista de reproducción o detalles de usuario).
- Recibe respuestas en formato JSON del backend.

#### Backend:
- Recibe solicitudes del frontend.
- Procesa la lógica de negocio (verifica permisos de usuario, prepara listas de canciones, etc.).
- Consulta la base de datos para obtener información adicional.
- Devuelve los resultados en formato JSON.

#### Base de Datos:
- Almacena datos relevantes como usuarios, listas de reproducción, canciones y configuraciones.
- El backend consulta la base de datos para obtener o almacenar datos.

#### Infraestructura:
- **GitHub Actions:** Se encarga de la integración continua y automatiza pruebas y despliegue del código.
- **DigitalOcean:** Se encarga de desplegar la aplicación cuando las pruebas son satisfactorias.

## Estructura del Proyecto

```
AuralisMusic/
├── backend/
│   ├── public/
│   ├── src/
│   │   ├── config/
│   │   ├── controladores/
│   │   ├── middlewares/
│   │   ├── modelos/
│   │   ├── rutas/
│   │   ├── seeders/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── models/
│   ├── angular.json
│   └── package.json
└── README.md
```

### Descripción

#### backend/
Contiene el código del servidor backend, desarrollado en Node.js. Aquí se gestionan las rutas, controladores, lógica de negocio y conexión a bases de datos.

#### frontend/
Contiene la aplicación del lado del cliente, desarrollada en Angular. Se divide en varias secciones:
- **components/**: Componentes reutilizables de la UI.
- **pages/**: Vistas o rutas principales del frontend.
- **services/**: Servicios para comunicarse con APIs externas.
- **guards/**: Protección de rutas mediante autenticación.
- **models/**: Modelos de datos para el frontend.

## Consideraciones de Seguridad

- **Protección de rutas frontend:** Uso de autenticación y validación de roles.
- **Protección de rutas backend:** Uso de JWT y verificación de permisos.
- **Hashing de contraseñas:** Uso de bcrypt para proteger credenciales.
- **Validación de datos:** Uso de librerías como Joi o Yup para asegurar entradas seguras.
- **HTTPS:** Implementación de comunicación segura entre cliente y servidor.
- **Control de acceso:** Listas de control de acceso (ACL) en el backend.

## Modelo de Datos

La base de datos utiliza MongoDB con las siguientes entidades:

### Usuarios
- email
- nombre
- password (hash)
- listasReproduccion (creadoPor, canciones[], nombre)
- rol
- isVerified

### Canciones
- cantante
- álbum
- género
- fileUrl
- imagen

### Playlists
- nombre
- creador
- canciones[]

### Cantante
- cantante
- canciones[]
- avatar

## Tecnologías de Desarrollo

- **Editor de código:** Visual Studio Code
- **Control de versiones:** Git
- **Colaboración:** Slack, Trello

## Trabajo en Equipo

- **Nicolás Herrera:** Desarrollador Backend
- **Sebastián Rodríguez:** Desarrollador Backend
- **Carlos Barragán:** Desarrollador Frontend

