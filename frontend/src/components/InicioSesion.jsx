import { useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'

import { Link, useNavigate } from 'react-router-dom'
import { insignia, bg } from '../assets'
import { useAuth } from '../provider/AuthContext'

const InicioSesion = () => {

  /* Se utiliza destructuring para obtener la función que agregará el email ingresado (setEmail). */
  const { setEmail } = useAuth()

  /* Se utiliza la función "useNavigate" de 'react-router-dom' para poder redireccionar a otras páginas. */
  const navigate = useNavigate()

  /* un useState de errores para el formulario, en el cual, inicializa con un objeto vacío, para luego, en caso de errores, llenar este objeto. */
  const [errors, setErrors] = useState({})

  /* un useState de valores de los inputs del formulario, en el cual, inicializan con dos valores vacíos de email y password. */
  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  /* Validación para formulario con la herramienta Yup. */
  const validacion = Yup.object().shape({
    email: Yup.string()
      .required("Debes escribir un email")
      .email('Debes escribir un email válido')
      .test('emailRegistrado', 'Este email no está registrado', async (value) => {

        /* En caso de pasar a esta instancia, luego de las validaciones anteriores,
          se realizará una petición mediante Axios, para verificar si el email ingresado se encuentra en la base de datos. */
        try {
          const emailResponse = await axios.post('http://localhost:4000/emailRegistrado', { email: value })
          const emailRegistrado = emailResponse.data

          return emailRegistrado
        } catch (error) {
          return true
        }
      }),
    password: Yup.string()
      .required("Debes escribir una contraseña")
      .test('passwordCorrecto', 'La contraseña no es correcta', async (value, { parent }) => {
        if (!value || !parent.email) return true
        try {
          const response = await axios.post('http://localhost:4000/iniciarsesion', {
            email: parent.email,
            password: value
          })

          return !!response.data.token
        } catch (error) {
          return false
        }
      })
  })

  /* Función que será enviada al evento onChange de cada uno de los inputs del formulario. Se usa para ingresar un nuevo estado en la entrada. */
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  /* Función que será enviada al evento onSubmit del formulario. Se ejecuta cuando el submit es tocado. */
  const handleSubmit = async (e) => {

    /* Esta función permite que, cuando se haga el submit, no se refresque la página. */
    e.preventDefault()

    try {

      /* Comprueba si los datos ingresados de los inputs son correctos. */
      await validacion.validate(values, { abortEarly: false })

      /* Se realiza un envío al backend con los datos de los inputs ingresados. */
      const response = await axios.post('http://localhost:4000/iniciarsesion', values)

      /* El token es guardado en localStorage. */
      const token = response.data.token
      localStorage.setItem('token', token)

      /* El email es guardado en localStorage, y a su vez, en toda la app, para que se pueda tener acceso a él. */
      setEmail(values.email)
      localStorage.setItem("email", values.email)
      
      /* Por último, una vez iniciado sesión, se redirige a "/" */
      navigate('/')
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
      <div className='shadow-xl backdrop-blur-sm bg-[rgb(0,149,216,0.04)] border p-6 rounded-lg lg:min-w-[500px] w-[500px] m-auto flex flex-col items-center justify-center'>

        <div className='flex my-2 items-center'>
          <img src={insignia} alt="" width={'75px'} />
          <p className='p-2 text-lg font-bold uppercase'>Iniciar sesión</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col w-full' noValidate>

          <label className={labelStyles}>Email:</label>
          <input
            name="email"
            className={inputStyles}
            type="email"
            onChange={handleChange}
            required
          />

          {errors.email && <p className={errorsStyles}>{errors.email}</p>}

          <label className={labelStyles}>Contraseña:</label>
          <input
            name="password"
            className={inputStyles}
            type="password"
            onChange={handleChange}
            required
          />

          {errors.password && <p className={errorsStyles}>{errors.password}</p>}

          <input
            className={`rounded my-4 border-none bg-[#0095d8] hover:bg-[rgb(0,149,216,0.8)] transition-colors text-white font-semibold cursor-pointer ${inputStyles}`}
            type="submit"
            value="Ingresar"
          />
        </form>

        <p>
          ¿No tenés una cuenta?&nbsp;
          <Link
            to={'/registro'}
            className='underline cursor-pointer font-semibold'
          >
            ¡Creá una!
          </Link>
        </p>

      </div>
    </main>
  )
}

export default InicioSesion