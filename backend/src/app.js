const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const mainRouter = require("./routes/mainRouter")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.listen(4000, () => {console.log('server running at 4000')})
app.use(mainRouter)