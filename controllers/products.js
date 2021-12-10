
const DataManager = require("../helpers/DataManager")
const STATUS_CODE = require("../helpers/statusCode")
const constants = require("../helpers/constants")


const productManager = new DataManager("productos")
module.exports = {
   getProducts: (req, res) => {
      const products = productManager.getData()

      res.json({ products })
   },
   getProduct: (req, res) => {
      const id = req.params.id
      const product = productManager.getData(id)
      if (!product) res.status(STATUS_CODE.NOT_FOUND).json({ message: "Producto no encontrado" })
      res.json({ product })

   },
   createProduct: (req, res) => {
      const { product_name, product_price } = req.body
      const file = req.files

      if (!file) {
         res.status(STATUS_CODE.BAD_REQUEST).json({ message: "No se ha subido ninguna imagen" })
      }
      if (!product_name || !product_price) {
         res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Los datos propuestos son incorrectos o no se enviaron" })
      }
      const product = {
         title: product_name,
         price: product_price,
         thumbnail: `${constants.URL}/uploads/${file[0].filename}`
      }

      const newProduct = productManager.createData(product)

      res.json({ message: "Producto creado", product: newProduct })
   },

   updateProduct: (req, res) => {
      const { product_name, product_price } = req.body

      if (!product_name || !product_price || req.files.length == 0) {
         res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Los datos propuestos son incorrectos o no se enviaron" })
      }

      const id = req.params.id
      const file = req.files

      const newProduct = { title: product_name, price: product_price, thumbnail: `${constants.URL}/uploads/${file[0].filename}` }
      const isEdited = productManager.updateData(id, newProduct)
      if (!isEdited) {
         res.status(STATUS_CODE.NOT_FOUND).json({ message: "Producto no encontrado" })
      }
      res.status(STATUS_CODE.OK).json(newProduct)
   },
   deleteProduct: (req, res) => {
      const { id } = req.params

      const isDeleted = productManager.deleteData(id)
      if (!isDeleted) res.status(STATUS_CODE.NOT_FOUND).json({ message: "Producto no encontrado" })
      res.status(STATUS_CODE.OK).json({ message: "Producto eliminado" })
   }

}