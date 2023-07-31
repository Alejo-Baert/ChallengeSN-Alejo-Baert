import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import * as Yup from 'yup'

import { insignia } from "../assets"

const Editar = () => {
    
    const navigate = useNavigate()

    /* Mediante destructuring, se extrae "id" del hook "useParams". */
    const { id } = useParams()

    /* Se inicializa los campos vacíos, para luego ser llenados mediante la consulta desde backend. */
    const defaultUsuarioEditar = {
        nombre: '',
        apellido: '',
        dni: '',
        fecha: '',
    }

    const [usuarioEditar, setUsuarioEditar] = useState(defaultUsuarioEditar)
    const [errors, setErrors] = useState({})

    const handleEditar = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/editar/${id}`)
            setUsuarioEditar(response.data.user)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        handleEditar()
    }, [])

    const validacion = Yup.object().shape({
        nombre: Yup.string().min(2, 'Debe tener al menos dos caracteres').required('Debes escribir un nombre'),
        apellido: Yup.string().min(2, 'Debe tener al menos dos caracteres').required('Debes escribir un apellido'),
        fecha: Yup.string().required('Debes escribir una fecha'),
        dni: Yup.string().min(6, 'Debe tener al menos 6 caracteres').required('Debes escribir un DNI'),
    })

    const handleChange = (e) => setUsuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await validacion.validate(usuarioEditar, { abortEarly: false })
            const response = await axios.put(`http://localhost:4000/${id}`, usuarioEditar)
            if (response.data.errors) {
                setErrors(response.data.errors)
            }
            else {
                setErrors({})
                navigate('/main')
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                const yupErrors = {}

                error.inner.forEach((err) => {
                    yupErrors[err.path] = err.message
                })
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
    const stylesButtonOutline = 'border-[#0095d8] hover:bg-[rgb(0,149,216,0.1)] transition-colors border font-semibold p-2 rounded-md text-[#0095d8]'

    return (
        <div className="h-screen items-center m-4 flex ">
            <div className='shadow-xl bg-[rgb(0,149,216,0.04)] border p-6 rounded-lg lg:min-w-[500px] w-[500px] mx-auto flex flex-col items-center justify-center'>
                <div className="w-full">
                    <Link to={'/main'} className={`${stylesButtonOutline} px-4`}>Volver atrás</Link>
                    <div className='flex my-2 items-center justify-center'>
                        <img src={insignia} alt="" width={'75px'} />
                        <p className='p-4 text-lg font-bold uppercase'>Editar datos</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col w-full' noValidate>

                    <label className={labelStyles}>Nombre:</label>
                    <input
                        name="nombre"
                        className={inputStyles}
                        type="text"
                        value={usuarioEditar.nombre}
                        onChange={handleChange}
                        required
                    />

                    {errors.nombre && <p className={errorsStyles}>{errors.nombre}</p>}

                    <label className={labelStyles}>Apellido:</label>
                    <input
                        name="apellido"
                        className={inputStyles}
                        type="text"
                        value={usuarioEditar.apellido}
                        onChange={handleChange}
                        required
                    />

                    {errors.apellido && <p className={errorsStyles}>{errors.apellido}</p>}

                    <label className={labelStyles}>DNI:</label>
                    <input
                        name="dni"
                        className={inputStyles}
                        type="number"
                        value={usuarioEditar.dni}
                        onChange={handleChange}
                        required
                    />

                    {errors.dni && <p className={errorsStyles}>{errors.dni}</p>}

                    <label className={labelStyles}>Fecha de Nacimiento:</label>
                    <input
                        name="fecha"
                        className={inputStyles}
                        type="date"
                        value={usuarioEditar.fecha}
                        onChange={handleChange}
                        required
                    />

                    {errors.fecha && <p className={errorsStyles}>{errors.fecha}</p>}

                    <input
                        className={`rounded my-4 border-none bg-blue-500 text-white font-semibold cursor-pointer ${inputStyles}`}
                        type="submit"
                        value="Editar datos"
                    />
                </form>
            </div>
        </div>
    )
}

export default Editar