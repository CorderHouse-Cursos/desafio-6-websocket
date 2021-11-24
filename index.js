const ApiServer = require("./ApiServer")



const app = new ApiServer(3000);
app.settings()
app.startServer()


module.exports = app