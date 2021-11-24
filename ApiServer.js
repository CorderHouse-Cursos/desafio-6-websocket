const express = require("express");
const routes = require("./routes");
const multer = require("multer")
const morgan = require("morgan");
const fs = require("fs");

class ApiServer {
   constructor(port) {
      this.app = express()
      this.port = process.env.PORT || port

   }

   __settingsMulter() {
      this.storage = multer.diskStorage({
         destination: `${__dirname}/public/uploads`,

         filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
         }
      })

      this.app.use(multer({
         storage: this.storage
      }).any())

   }
   __settingsRoutes() {
      this.app.use('/api/productos', routes)
   }
   settings() {
      this.app.use(express.json())
      this.app.use(express.urlencoded({ extended: true }))
      this.__settingsMulter()
      this.app.use('/', express.static(`${__dirname}/public`))
      this.app.use(morgan('dev'))
      this.__settingsRoutes()

      this.app.on("error", () => {
         console.log("error")
      })
   }
   startServer() {
      this.app.listen(this.port, () => {
         console.log(`Server running on port ${this.port}`)
      })
   }


}


module.exports = ApiServer


