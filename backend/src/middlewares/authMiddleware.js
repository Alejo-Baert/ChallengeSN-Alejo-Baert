const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ mensaje: 'Acceso no autorizado. Debes proporcionar un token.' })

  jwt.verify(token, 'secreto_del_token', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválido. Acceso no autorizado.' })
    }

    req.user = decodedToken
    next()
  })
}

module.exports = { verificarToken }