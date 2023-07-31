const multer = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../../frontend/public/images"),
    filename: function (req, file, cb) {
      cb(null, "image-" + Date.now() + path.extname(file.originalname)) 
    },
  })
  
const upload = multer({ storage })

module.exports = upload