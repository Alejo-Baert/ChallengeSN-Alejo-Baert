import { useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'

import { Link, useNavigate } from 'react-router-dom'
import { bg, insignia } from '../assets'

const Registro = () => {

  /* Se utiliza la función "useNavigate" de 'react-router-dom' para poder redireccionar a otras páginas. */
  const navigate = useNavigate()

  /* un useState de errores para el formulario, en el cual, inicializa con un objeto vacío, para luego, en caso de errores, llenar este objeto. */
  const [errors, setErrors] = useState({})

  /* un useState de valores de los inputs del formulario, en el cual, inicializan con valores vacíos. */
  const [values, setValues] = useState({
    nombre: '',
    apellido: '',
    fecha: '',
    dni: '',
    email: '',
    password: '',
    foto: null,
  })

  /* Validación para formulario con la herramienta Yup. */
  const validacion = Yup.object().shape({
    nombre: Yup.string().min(2, 'Debe tener al menos dos caracteres').required('Debes escribir un nombre'),
    apellido: Yup.string().min(2, 'Debe tener al menos dos caracteres').required('Debes escribir un apellido'),
    email: Yup.string()
      .required('Debes escribir un email')
      .email('Debes escribir un email válido')
      .test('emailRegistrado', 'Este email ya está registrado', async (value) => {

        /* En caso de pasar a esta instancia, luego de las validaciones anteriores,
          se realizará una petición mediante Axios, para verificar si el email ingresado se encuentra en la base de datos. */
        try {
          const emailResponse = await axios.post('http://localhost:4000/emailRegistrado', { email: value })
          const emailRegistrado = emailResponse.data

          return !emailRegistrado
        } catch (error) {
          return true
        }
      }),
    password: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('Debes escribir una contraseña'),
    fecha: Yup.string().required('Debes escribir una fecha'),
    dni: Yup.string().min(6, 'Debe tener al menos 6 caracteres').required('Debes escribir un DNI'),
    foto: Yup.mixed().required('Debes subir una foto de perfil')
  })

  /* Función que será enviada al evento onChange de cada uno de los inputs del formulario, a excepción del campo "foto".
  Se usa para ingresar un nuevo estado en la entrada. */
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  /* Función que sólo será enviada al evento onChange del campo "foto" */
  const handleFoto = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, foto: file });
  }

  /* Función que será enviada al evento onSubmit del formulario. Se ejecuta cuando el submit es tocado. */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      /* Comprueba si los datos ingresados de los inputs son correctos. */
      await validacion.validate(values, { abortEarly: false })

      /* Se utiliza el objeto FormData para almacenar los datos del formulario. */
      const formData = new FormData()
      formData.append('nombre', values.nombre)
      formData.append('apellido', values.apellido)
      formData.append('fecha', values.fecha)
      formData.append('dni', values.dni)
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('foto', values.foto)

      /* Se realiza un envío al backend con los datos de los inputs ingresados. */
      const response = await axios.post('http://localhost:4000/registro', formData)
      if (response.data.errors) {
        setErrors(response.data.errors)
      }
      else {
        setErrors({})
        navigate('/iniciarsesion')
      }
    }

    /* En caso de error, se ejecuta este bloque. */
    catch (error) {

      /* Si el error tiene como nombre "ValidationError", se ejecuta la condición: */
      if (error.name === 'ValidationError') {

        /* Variable con objeto vacío, que almacenará errores de Yup. */
        const yupErrors = {}

        /* Se recorre cada uno de los errores de Yup. */
        error.inner.forEach((err) => {
          /* path representa el nombre del error y message, el mensaje del mismo. */
          yupErrors[err.path] = err.message
        })
        /* yupErrors estará guardado en setErrors,
        función por la cual, mostrará los errores en pantalla a través de la variable inicial "error" de useState. */
        setErrors(yupErrors)

      } else if (error.response && error.response.data) {
        setErrors(error.response.data)
      }
      else console.error('Error al enviar el formulario:', error)
    }
  }
  
  /* Variables con estilos */
  const labelStyles = 'font-semibold text-[14px] mt-2'
  const inputStyles = 'border-2 rounded p-2'
  const errorsStyles = 'text-red-500 font-medium'

  return (
    <main style={{ backgroundImage:`url(${bg})`}} className='min-h-screen bg-no-repeat bg-cover flex text-[#363636] p-4'>
      <div className='shadow-xl backdrop-blur-sm bg-[rgb(0,149,216,0.04)] border p-6 rounded-lg max-w-full m-auto flex flex-col items-center justify-center'>

        <div className='flex my-2 items-center'>
          <img src={insignia} alt="" width={'75px'} />
          <p className='p-2 text-lg font-bold uppercase'>Crear una cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col w-full' encType='multipart/form-data' noValidate>
          <label className={labelStyles}>Nombre:</label>
          <input
            name="nombre"
            className={inputStyles}
            type="text"
            value={values.nombre}
            onChange={handleChange}
            required
          />

          {errors.nombre && <p className={errorsStyles}>{errors.nombre}</p>}

          <label className={labelStyles}>Apellido:</label>
          <input
            name="apellido"
            className={inputStyles}
            type="text"
            value={values.apellido}
            onChange={handleChange}
            required
          />

          {errors.apellido && <p className={errorsStyles}>{errors.apellido}</p>}

          <label className={labelStyles}>Email:</label>
          <input
            name="email"
            className={inputStyles}
            type="email"
            value={values.email}
            onChange={handleChange}
            required
          />

          {errors.email && <p className={errorsStyles}>{errors.email}</p>}

          <label className={labelStyles}>Contraseña:</label>
          <input
            name="password"
            className={inputStyles}
            type="password"
            value={values.password}
            onChange={handleChange}
            required
          />

          {errors.password && <p className={errorsStyles}>{errors.password}</p>}

          <label className={labelStyles}>DNI:</label>
          <input
            name="dni"
            className={inputStyles}
            type="number"
            value={values.dni}
            onChange={handleChange}
            required
          />

          {errors.dni && <p className={errorsStyles}>{errors.dni}</p>}

          <label className={labelStyles}>Fecha de Nacimiento:</label>
          <input
            name="fecha"
            className={inputStyles}
            type="date"
            value={values.fecha}
            onChange={handleChange}
            required
          />

          {errors.fecha && <p className={errorsStyles}>{errors.fecha}</p>}

          <label className={labelStyles}>Foto de Perfil:</label>
          <input
            name="foto"
            className={inputStyles}
            type="file"
            onChange={handleFoto}
            accept='image/png, image/jpg, image/jpeg, image/gif'
            required
          />

          {errors.foto && <p className={errorsStyles}>{errors.foto}</p>}

          <input
            className={`rounded my-4 border-none bg-[#0095d8] hover:bg-[rgb(0,149,216,0.8)] transition-colors text-white font-semibold cursor-pointer ${inputStyles}`}
            type="submit"
            value="Registrarse"
          />
        </form>

        <p>
          ¿Ya tenés una cuenta?&nbsp;
          <Link
            to={'/iniciarsesion'}
            className='underline cursor-pointer font-semibold'
          >
            ¡Iniciá sesión!
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Registro