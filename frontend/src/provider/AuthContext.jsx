import { createContext, useContext, useState } from "react"
import { useLocation } from "react-router-dom"

/* Se crea un contexto con "createContext". */
const AuthContext = createContext()

/* El contexto creado se inserta en "useContext", y se llamará useAuth */
export function useAuth() {
  return useContext(AuthContext)
}

/* Se usa un contexto global para poder tener acceso al email obtenido del localStorage en toda la app */
export function AuthProvider({ children }) {
  const location = useLocation()
  const storedEmail = localStorage.getItem("email")
  const [email, setEmail] = useState(storedEmail)

  /* El Provider será el que envuelva los componentes que estén dentro, esto gracias a "children". */
  return (
    /* "Value" será el medio por el cual se envían las variables a utilizar en estos componentes que son hijos del Provider. */
    <AuthContext.Provider value={{ email, setEmail, location }}>
      {children}
    </AuthContext.Provider>
  )
}