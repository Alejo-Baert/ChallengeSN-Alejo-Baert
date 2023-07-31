# Challenge San Nicolás | Alejo Baert

## Front End

### Estructura del proyecto

```
├── public
│   ├── images
│   │   └── ...
│   └── logo.ico
├── src
│   ├── assets
│   │   └── ...
│   ├── components
│   │   └── ...
│   ├── provider
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```


### Correr el cliente
- Utilizar `npm run dev` para correr en development.


### Tecnologías utilizadas
- ReactJS (Vite)
- Javascript
- Tailwind CSS
- Axios
- React Router
- Sweet Alert
- Yup (Validaciones)


### *Rutas:*

Dentro de la carpeta `components`, se encuentran los siguientes archivos:

```
components
    └── Hero.jsx -> Lo primero que ve un usuario nuevo al entrar a la app. Se encontrará con las opciones de registro e iniciar sesión.
    │
    └── Registro.jsx -> El usuario podrá registrarse ingresando sus datos.
    │
    └── InicioSesion.jsx -> El usuario podrá iniciar sesión ingresando sus datos previamente registrados.
    │
    └── Principal.jsx -> Una vez iniciado sesión, ésta es la vista en la que verá el usuario con sus datos, dependiendo si sea Admin o usuario común.
    │
    └── Editar.jsx -> El usuario común podrá editar datos de su perfil. El Admin podrá editar y/o eliminar los usuarios registrados. 
    │
    └── index.js -> Este archivo tiene como función importar los componentes mencionados anteriormente, para luego exportarlos como un objeto.
```