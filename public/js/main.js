



const socket = io.connect(window.location.origin)


socket.on("products", data => {
   console.log(data)
   const html = data.map(product => {
      return (` <tr>
         <th scope="row">${product.id}</th>
         <td><img width="150px" src="${product.thumbnail}"/></td>
         <td>${product.title}</td>
         <td>${product.price}</td>        
       </tr>`)
   })

   document.getElementById("products").innerHTML = html.join("")
})

socket.on("messages", data => {


   const html = data.map(message => {
      return (`   
      <p class="card-text" id="messages_content">
      <span style="color:blue;font-weight:bold">${message.email}</span>
      <span style="color:brown">[${message.date}]</span>
      <span style="color:green;font-style:italic">${message.text}</span>
     </p>`)
   })

   document.getElementById("messages").innerHTML = html.join("")
})

async function addProduct(e) {
   e.preventDefault()

   const formData = new FormData()
   if (document.getElementById("product_name") === "" || document.getElementById("product_price") === "" || document.getElementById("product_thumbnail") === "") {
      alert("Debe llenar todos los campos")
      return
   }
   if (document.getElementById("product_image").files[0] === undefined) {
      alert("Debe seleccionar una imagen")
      return
   }
   formData.append("product_image", document.getElementById("product_image").files[0])
   formData.append("product_name", document.getElementById("product_name").value)
   formData.append("product_price", document.getElementById("product_price").value)


   try {
      const res = await fetch(window.location.origin + "/productos", {
         method: "POST",
         body: formData

      })
      const data = await res.json()
      socket.emit("new-product", data.product)
   } catch (err) {
      alert("Error al crear")
   }


   document.getElementById("formproducts").reset()

}
async function sendMessage(e) {
   e.preventDefault()


   const email = document.getElementById("email").value
   const message = document.getElementById("message").value
   if (email === "" || message === "") {
      alert("Debe llenar todos los campos")
      return
   }
   socket.emit("new-message", {
      message,
      email
   })





   document.getElementById("formmessages").reset()

}
document.getElementById("formproducts").addEventListener("submit", addProduct)
document.getElementById("formmessages").addEventListener("submit", sendMessage)