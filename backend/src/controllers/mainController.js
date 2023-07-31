const db = require("../../database/models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    lista: async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || PAGE_SIZE

        try {
            const offset = (page - 1) * limit
            const users = await db.User.findAll({ limit, offset })
            const totalUsuarios = await db.User.count()
            const totalPaginas = Math.ceil(totalUsuarios / limit)

            res.json({ users, totalPaginas })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al obtener la lista de usuarios' })
        }
    },
    emailRegistrado: async (req, res) => {
        try {
            let userInDB = await db.User.findOne({
                where: { email: req.body.email }
            })

            if (userInDB) res.json(userInDB)
            else res.status(404).json({ error: "Usuario no encontrado" })
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los datos del usuario" })
        }
    },
    registro: async (req, res) => {
        try {
            const { nombre, apellido, fecha, dni, email } = req.body
            const usuario = await db.User.create({
                nombre,
                apellido,
                fecha,
                dni,
                email,
                password: bcrypt.hashSync(req.body.password, 10),
                foto: req.file ? "/images/" + req.file.filename : "default-image.png"
            })
            res.status(201).json(usuario)

        } catch (error) {
            console.error('Error al crear el usuario:', error)
            res.status(500).json({ error: 'Error al crear el usuario' })
        }
    },
    iniciarsesion: async (req, res) => {
        try {
            const user = await db.User.findOne({ where: { email: req.body.email } })

            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({ mensaje: 'Correo electrónico o contraseña incorrectos.' })
            }

            const token = jwt.sign({ userId: user.id }, 'secreto_del_token', { expiresIn: '1h' })
            res.json({ token })

        } catch (error) {
            console.error('Error al iniciar sesión:', error)
            res.status(500).json({ error: 'Error al iniciar sesión' })
        }
    },
    cerrarsesion: async (req, res) => {
        res.json({ mensaje: 'Sesión cerrada correctamente.' })
    },
    perfil: async (req, res) => {
        const userId = req.user.userId
        const userInDB = await db.User.findByPk(userId)

        if (userInDB) {
            return res.status(200).json({
                user: {
                    id: userInDB.id,
                    nombre: userInDB.nombre,
                    apellido: userInDB.apellido,
                    email: userInDB.email,
                    dni: userInDB.dni,
                    fecha: userInDB.fecha,
                    foto: userInDB.foto,
                }
            })
        } else return res.status(404).json({ mensaje: "Usuario no encontrado" })
    },
    editar: async (req,res) => {
        const userId = req.params.id

        const user = await db.User.findOne({
            where: { id: userId }
        })
        if(user) res.status(200).json({ user })
        else return res.status(404).json({ mensaje: "Usuario no encontrado" })
    },
    update: async (req,res) => {
        const userId = req.params.id

        const user = await db.User.findOne({
            where: { id: userId }
        })
        if(user){
            const { nombre, apellido, fecha, dni, email } = req.body
            await db.User.update({
                nombre,
                apellido,
                fecha,
                dni,
                email,
            },
            { where: { id: req.params.id }})
            res.status(200).json({ user: "Usuario editado" })
        }
        else {
            return res.status(404).json({ mensaje: "Usuario no encontrado" })
        }
    },
    borrar: async (req,res) => {
        await db.User.destroy({ where: { id:req.params.id }})
    }
}