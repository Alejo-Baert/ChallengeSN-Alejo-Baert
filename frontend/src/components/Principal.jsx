import { useEffect, useState } from "react"
import axios from "axios"
import swal from 'sweetalert'

import { Link, useNavigate } from 'react-router-dom'
import { bg, insignia, pencilIcon, trashIcon } from "../assets"
import { useAuth } from "../provider/AuthContext"

const Principal = () => {

  /* Se utiliza destructuring para obtener el email guardado en localStorage. */
  const { email } = useAuth()

  /* Se utiliza la función "useNavigate" de 'react-router-dom' para poder redireccionar a otras páginas. */
  const navigate = useNavigate()

  /* Variable para mostrar todos los usuarios de la base de datos. */
  const [users, setUsers] = useState([])

  /* Variable para mostrar los datos del usuario logueado. */
  const [logeado, setLogueado] = useState([])

  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  /* Tamaño máximo de usuarios en una página. */
  const PAGE_SIZE = 10

  /* Función que será mostrado si el usuario es Admin. */
  const fetchUsuarios = async (page) => {
    /* Se envía, mediante la url, la página actual, y el tamaño de usuarios en una página. */
    await axios.get(`http://localhost:4000/lista?page=${page}&limit=${PAGE_SIZE}`)
      .then(response => {
        setUsers(response.data.users)
        setTotalPaginas(response.data.totalPaginas)
      })
  }

  const handlePageChange = (newPage) => setPaginaActual(newPage)

  /* Función que será mostrado si el usuario no es Admin. */
  const fetchLogeado = async () => {

    /* Obtiene el token de localStorage, si existe, ejecutará el bloque try-catch. */
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await axios.get('http://localhost:4000/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setLogueado(response.data.user)
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error)
      }
    }
  }

  useEffect(() => {
    fetchUsuarios(paginaActual)
    fetchLogeado()
  }, [paginaActual])

  /* Función que elimina el token y el email de localStorage, por lo cual, cierra sesión del usuario. */
  const handleCerrarSesion = async () => {
    try {
      await axios.post('http://localhost:4000/cerrarsesion')
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  /* Función que borra usuario según su id. */
  const borrarUsuario = async (id) => {

    /* Modal alert */
    swal({
      title: "¿Estás seguro de que querés borrar este usuario?",
      text: "Una vez eliminado, no se puede volver atrás.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          try {
            await axios.delete(`http://localhost:4000/${id}/delete`)
            .then(window.location.reload())
          } catch (error) {
            console.error(error)
          }
        }
      })
  }

  /* Variables con estilos */
  const stylesButton = 'bg-[#0095d8] hover:bg-[rgb(0,149,216,0.8)] transition-colors font-semibold p-2 rounded-md  text-white'
  const stylesButtonOutline = 'border-[#0095d8] hover:bg-[rgb(0,149,216,0.1)] transition-colors border font-semibold p-2 rounded-md text-[#0095d8]'
  const hrStyles = 'h-[2px] bg-[rgb(54,54,54,0.2)]'

  return (
    <main>
      <nav className="bg-[#fafafa] sticky top-0 z-10 flex items-center justify-between px-6 py-2 shadow">
        <Link to={'/'}>
          <img src={insignia} width={'70px'} alt="insignia"/>
        </Link>
        <button
          className={`${stylesButton}`}
          onClick={handleCerrarSesion}
        >
          Cerrar Sesión
        </button>
      </nav>

      <div>

        {/* Si el usuario que se logueó, es Admin, verá la primer condición, si es otro usuario común, verá la segunda condición. */}
        {email === "admin@admin.com.ar"
          ? (
            <div className="my-8">
              <h1 className="uppercase font-semibold text-center mx-4 text-[18px]">Lista de usuarios</h1>
              <div className="px-12 py-6">

                <table className='min-w-full text-left font-light'>
                  <thead className="dark:bg-neutral-600 text-white border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Apellido</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">DNI</th>
                      <th className="px-6 py-4">Fecha de nacimiento</th>
                      <th className="px-6 py-4">Opciones</th>
                    </tr>
                  </thead>

                  {/* Se hace un mapeo de todos los usuarios registrados de la base de datos,
                      mostrándose en pantalla y con la posibilidad de editar y/o eliminarlos. */}
                  {users.map(user => (
                    <tbody key={user.id}>
                      <tr className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{user.id}</td>
                        <td className="whitespace-nowrap px-6 py-4">{user.nombre}</td>
                        <td className="whitespace-nowrap px-6 py-4">{user.apellido}</td>
                        <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                        <td className="whitespace-nowrap px-6 py-4">{user.dni}</td>
                        <td className="whitespace-nowrap px-6 py-4">{user.fecha}</td>
                        <td className="whitespace-nowrap px-6 py-4 flex gap-4">

                          <Link to={`/editar/${user.id}`}>
                            <div className="cursor-pointer hover:bg-[rgb(0,149,216,0.3)] rounded-full p-1">
                              <img src={pencilIcon} width={'25px'} className="" alt="pencil" />
                            </div>
                          </Link>
                          <div className="cursor-pointer hover:bg-[rgba(245,40,40,0.3)] rounded-full p-1" onClick={() => { borrarUsuario(user.id) }}>
                            <img src={trashIcon} width={'25px'} alt="trash" />
                          </div>

                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
                <div className="mt-6 w-full justify-center flex">

                  {/* Se hace un recorrido de las cantidad de páginas según los usuarios registrados. */}
                  {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((page) => (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`py-2 border rounded mx-1 px-4 ${paginaActual === page ? 'bg-[#0095d8] text-white' : 'bg-white text-black'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          )
          : (
            <div style={{backgroundImage:`url(${bg})`}} className="mt-1 min-h-screen bg-no-repeat bg-cover py-8" >
              <div className="shadow-xl backdrop-blur-md bg-[rgb(0,149,216,0.04)] text-[#363636] max-w-3xl md:mx-auto mx-6 border rounded-lg px-6 py-4">
                <div className="flex flex-col items-center mb-6 text-center">
                  <img src={logeado.foto} alt="fotoimage" className="mb-2 w-[150px] h-[150px] border-[#0095d8] p-1 border-2 rounded-[50%] object-cover" />
                  <h1 className="font-semibold uppercase md:text-[18px] text-[14px]">¡Hola, <span>{logeado.nombre}</span>!</h1>
                  <h2 className="md:text-[16px] text-[12px]">Acá podrás ver tu perfil y modificar tus datos.</h2>
                </div>

                <hr className={`${hrStyles}`} />

                <p className="p-2"><strong>Nombre</strong>: {logeado.nombre}</p>
                <hr className={`${hrStyles}`} />

                <p className="p-2"><strong>Apellido</strong>: {logeado.apellido}</p>
                <hr className={`${hrStyles}`} />

                <p className="p-2"><strong>Email</strong>: {logeado.email}</p>
                <hr className={`${hrStyles}`} />

                <p className="p-2"><strong>DNI</strong>: {logeado.dni}</p>
                <hr className={`${hrStyles}`} />

                <p className="p-2"><strong>Fecha de nacimiento</strong>: {logeado.fecha}</p>
                <hr className={`${hrStyles}`} />

                <div className="flex justify-center mt-4">
                  <Link to={`/editar/${logeado.id}`}>
                    <button className={`flex gap-2 ${stylesButtonOutline}`}>
                      <img src={pencilIcon} width={'25px'} alt="editarIcono" />
                      <p>Editar datos</p>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
      </div>
    </main>
  )
}

export default Principal