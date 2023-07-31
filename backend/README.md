# Challenge San Nicolás | Alejo Baert

## Back End

## Estructura del proyecto

```
├── database
│   └── ...
├── public
├── src
│   ├── controllers
│   │   └── ...
│   ├── middlewares
│   │   └── ...
│   ├── routes
│   │   └── ...
│   └── app.js
├── .sequelizerc
├── package-lock.json
├── package.json
└── README.md
```

### Correr el servidor
- Utilizar `npm run start`.


### Tecnologías utilizadas
- Express
- Bcrypt
- JWT
- Multer
- Sequelize


### Introducción
'Challenge SN' es una app en la cual, los usuarios pueden registrarse e iniciar sesión con sus datos personales. Podrán observar su perfil y editarlo.


### *Usuario:*
Es la persona que utiliza la aplicación, puede registrarse e iniciar sesión.
Hay dos tipos de usuarios en esta aplicacion, el administrador (en el cual sólo puede haber uno con el email "admin@admin.com.ar"), y el usuario común. El primero es capaz de editar y/o eliminar los usuarios registrados, mientras que el segundo puede visualizar su perfil con sus datos y editarlos.

**Atributos**
|  Nombre  |   Tipo   |
|  ------  |  ------  |
|    id    |  integer |
|  nombre  |  string  |
| apellido |  string  |
|  email   |  string  |
| password |  string  |
|   dni    |  string  |
|  fecha   |  string  |
|   foto   |  string  |

## *Acciones de usuario (Común):*

### Crear usuario: `POST /registro`
{
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    dni: number,
    fecha: date,
    foto: file (PNG, JPG, JPEG)
}

### Iniciar sesión: `POST /iniciarsesion`
{
    email: string,
    password: string,
}

### Observar el perfil del usuario logueado: `GET /perfil`
Se podrá observar la información del usuario logueado. El ID del usuario es obtenido mediante JWT.

### Editar el usuario logueado: `PUT /:id`
Edita la información del usuario logueado. El ID del usuario es obtenido mediante JWT.

### Cerrar sesión del usuario logueado: `POST /cerrarsesion`

## *Acciones de usuario (Admin):*

### Obtener los usuarios logueados: `GET /lista`
Retorna toda la información de los usuarios logueados.

### Editar el usuario logueado: `PUT /:id`
Edita la información del usuario logueado. El ID del usuario es obtenido mediante JWT.

### Eliminar el usuario logueado: `DELETE /:id/delete`
Elimina al usuario logueado. El ID del usuario es obtenido mediante JWT.
