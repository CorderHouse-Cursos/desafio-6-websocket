const fs = require("fs")
const path = require("path")

module.exports = class DataManager {
   constructor() {
      this.__loadData()
   }
   __loadData() {
      try {
         fs.readFile(path.join(__dirname, "../data/productos.json"), (err, data) => {
            if (err) {
               fs.writeFileSync(path.join(__dirname, "../data/productos.json"), JSON.stringify([]))
               console.log(err)
            }
            this.data = JSON.parse(data)
         })
      } catch (err) {
         console.log(err)
      }
   }
   __saveData(data) {
      fs.writeFileSync(path.join(__dirname, "../data/productos.json"), JSON.stringify(data))
   }
   getData(id) {
      return id ? this.data.find(item => item.id === parseInt(id)) : this.data
   }
   createData(data) {
      const last_id = this.data.length > 0 ? this.data[this.data.length - 1].id + 1 : 1
      const newData = { ...data, id: last_id }
      this.__saveData([...this.data, newData])
      this.data.push(newData)
      return newData
   }
   deleteData(id) {
      const product = this.data.find(item => item.id === parseInt(id))
      if (!product) return false
      const newData = this.data.filter(item => item.id !== parseInt(id))
      this.__saveData(newData)
      this.data = newData
      return true
   }
   updateData(id, data) {
      const product = this.data.find(item => item.id === parseInt(id))
      if (!product) return false
      console.log(path.join(__dirname, "../public/uploads/" + product.thumbnail))
      const newData = this.data.map(item => item.id == parseInt(id) ? { ...item, ...data } : item)
      this.__saveData(newData)
      return true
   }


}
