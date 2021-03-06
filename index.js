const express = require("express");
const routes = require("./routes");
const multer = require("multer")
const morgan = require("morgan");

const { Server: IOServer } = require("socket.io")
const { Server: HTTPServer } = require("http");
const DataManager = require("./helpers/DataManager");


const app = express();

const productManager = new DataManager("productos")
const messagesManager = new DataManager("messages")
const server = new HTTPServer(app);
const io = new IOServer(server);
const storage = multer.diskStorage({
   destination: `${__dirname}/public/uploads`,

   filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
   }
})

app.use(express.json());
app.use(multer({
   storage
}).any())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "hbs");
app.use('/', express.static(`${__dirname}/public`))
app.use('/productos', routes)
app.get("/", (req, res) => {
   res.render("pages/index")
})




server.listen(process.env.PORT || 3000, () => {
   console.log("Server is running on port 3000");
})


io.on("connection", (socket) => {
   console.log("New user connected" + socket.client);

   const products = productManager.getData()

   const messages = messagesManager.getData()

   io.emit("products", products)
   io.emit("messages", messages)
   socket.on("new-message", async (data) => {
      console.log(data)
      const fecha = new Date();
      var formattedDate = ("0" + fecha.getDate()).slice(-2) + '-' + ("0" + (fecha.getMonth() + 1)).slice(-2) + '-' + fecha.getFullYear() + ' ' + ("0" + fecha.getHours()).slice(-2) + ':' + ("0" + fecha.getMinutes()).slice(-2) + ':' + ("0" + fecha.getSeconds()).slice(-2);
      const message = {
         text: data.message,
         email: data.email,
         date: formattedDate
      }
      await messagesManager.createData(message)
      const messages = await messagesManager.getData()
      io.emit("messages", messages)
   })
   socket.on("new-product", async (data) => {
      console.log(data)
      const a = await productManager.getData()
      console.log(a)
      io.emit("products", [...a, data])
   })




   socket.on("disconnect", () => {
      console.log("User disconnected");
   })

})


