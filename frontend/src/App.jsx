import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { InicioSesion, Registro, Hero, Principal, Editar } from "./components"
import { AuthProvider } from "./provider/AuthContext"

function App() {

  /* Si existe un token en localStorage, devuelve true, caso contrario devuelve false. */
  const isUserAuthenticated = () => {
    const token = localStorage.getItem("token")
    return !!token
  }

  /* Si el usuario está logueado, está habilitado a poder ingresar a rutas que un usuario no logueado no podría. */
  const RutaProtegida = ({ children }) => {
    return isUserAuthenticated()
      ? children ? children : <Outlet />
      : <Navigate to="/iniciarsesion" replace />
  }

  return (
    <main>
      {/* AuthProvider envuelve todas las rutas para que tengan acceso al email guardado en localStorage. */}
      <AuthProvider>
        <Routes>

          {/* Se le pasa una prop al componente Hero para que el mismo, tenga acceso al token. (usuario logueado) */}
          <Route path="/" element={<Hero isUserAuthenticated={isUserAuthenticated} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/iniciarsesion" element={<InicioSesion />} />
          <Route path="*" element={<Navigate to="/" />} />

          {/* La ruta con la dirección "/main" está protegida, sólo será visualizada por el usuario logueado. */}
          <Route path="/main" element={
            <RutaProtegida>
              <Principal />
            </RutaProtegida>
          } />

          {/* La ruta con la dirección "/editar/:id" está protegida, sólo será visualizada por el usuario logueado. */}
          <Route path="/editar/:id" element={
            <RutaProtegida>
              <Editar />
            </RutaProtegida>
          } />

        </Routes>
      </AuthProvider>
    </main>
  )
}

export default App