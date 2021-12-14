
const fs = require("fs")
const path = require("path")

module.exports = class DataManager {

   constructor(name) {
      this.name = name ? name : "productos"
      this.__loadData()


   }
   __loadData() {
      try {
         fs.readFile(path.join(__dirname, `../data/${this.name}.json`), (err, data) => {
            if (err) {
               fs.writeFileSync(path.join(__dirname, `../data/${this.name}.json`), JSON.stringify({ data: [] }))
               console.log(err)
            }

            console.log("_loadData  " + this.name, JSON.parse(data).data.length)
            this.data = JSON.parse(data).data
         })
      } catch (err) {
         console.log(err)
      }
   }
   __saveData(data) {
      fs.writeFileSync(path.join(__dirname, `../data/${this.name}.json`), JSON.stringify({ data }))
   }
   getData(id) {
      this.__loadData()

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
      const isValid = this.data.find(item => item.id === parseInt(id))
      if (!isValid) return false
      const newData = this.data.filter(item => item.id !== parseInt(id))
      this.__saveData(newData)
      this.data = newData
      return true
   }
   updateData(id, data) {
      const isValid = this.data.find(item => item.id === parseInt(id))
      if (!isValid) return false
      const newData = this.data.map(item => {
         if (item.id === parseInt(id)) {
            item = { ...item, ...data }
         }
         return item
      })
      this.data = newData
      this.__saveData(newData)
      return true
   }


}
