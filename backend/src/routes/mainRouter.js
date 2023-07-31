const { Router } = require("express")
const { verificarToken } = require('../middlewares/authMiddleware')
const mainController = require("../controllers/mainController")
const upload = require('../middlewares/multer')
const router = Router()

router.get('/lista', mainController.lista)
router.get('/perfil', verificarToken, mainController.perfil)
router.get("/editar/:id", mainController.editar)
router.put("/:id", mainController.update);
router.delete("/:id/delete", mainController.borrar);

router.post('/registro', upload.single('foto'), mainController.registro)
router.post('/iniciarsesion', mainController.iniciarsesion)
router.post('/emailRegistrado', mainController.emailRegistrado)
router.post('/cerrarsesion', mainController.cerrarsesion)

module.exports = router