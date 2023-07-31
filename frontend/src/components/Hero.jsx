import { Link } from "react-router-dom"
import { header, insignia } from "../assets"
import { useAuth } from "../provider/AuthContext"
import { usersIcon, userIcon } from "../assets"

/* Se utiliza la prop "isUserAuthenticated", proveniente de App.jsx. */
const Hero = ({ isUserAuthenticated }) => {
    
    /* Se utiliza destructuring para obtener el email guardado en localStorage. */
    const { email } = useAuth()

    /* Variables de botones con estilos */
    const stylesButton = 'bg-[#0095d8] hover:bg-[rgb(0,149,216,0.8)] transition-colors font-semibold p-2 rounded-md  text-white'
    const stylesButtonOutline = 'border-[#0095d8] hover:bg-[rgb(0,149,216,0.1)] transition-colors border font-semibold p-2 rounded-md text-[#0095d8]'

    return (
        <div className="h-screen bg-[#161616]">
            <nav className="bg-[#fafafa] sticky top-0 z-10 flex items-center justify-between px-6 py-2 shadow">
                <img src={insignia} width={'70px'} alt="insignia" />
                <div className="flex gap-2">

                    {/* Si el usuario se encuentra logueado, verá la primer condición, caso contrario, verá la segunda condición. */}
                    {isUserAuthenticated()
                        ? (
                            <div>
                                <Link to={"/main"} className="font-semibold">
                                    
                                    {/* Si el usuario que se logueó, es Admin, verá la primer condición, si es otro usuario común, verá la segunda condición. */}
                                    {email === "admin@admin.com.ar"
                                        ? (<div className={`flex items-center sm:text-[16px] text-[12px] ${stylesButtonOutline}`}>
                                            <img src={usersIcon} width={'25px'} className="mr-1" alt="users" />
                                            <p>Ver usuarios</p>
                                        </div>)
                                        : (<div className={`flex items-center sm:text-[16px] text-[12px] ${stylesButtonOutline}`}>
                                            <img src={userIcon} width={'25px'} className="mr-1" alt="user" />
                                            <p>Ver Perfil</p>
                                        </div>)
                                    }
                                </Link>
                            </div>
                        )
                        : (
                            <div className="flex gap-2 sm:text-[16px] text-[12px]">
                                <Link to={'/registro'} className={`${stylesButtonOutline}`}>
                                    Registrarse
                                </Link>
                                <Link to={'/iniciarsesion'} className={`${stylesButton}`}>
                                    Iniciar Sesión
                                </Link>
                            </div>
                        )}
                </div>
            </nav>
            <div style={{ backgroundImage:`url(${header})`}} className="min-h-screen bg-cover bg-no-repeat bg-center bg-origin-content sm:py-0 py-20">
                <h1 className="py-4 text-white text-center font-semibold text-[18px]">Challenge SN | Alejo Baert</h1>
            </div>
        </div>
    )
}

export default Hero