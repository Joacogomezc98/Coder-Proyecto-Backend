import { carritoApi, productosApi } from "./daos/index.js"
import configs from "./configs.js"
import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Router } = express



const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(__dirname + '/public'))

const productRouter = Router()

const cartRouter = Router()


productRouter.get('/static', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


// PRODUCTS -------------------------------------------------------------------------------------------------------

// DEVOLVER TODOS LOS PRODS
productRouter.get('/', (req, res) => {

    productosApi.getAll()
        .then(data => res.send(data))

})

// DEVOLVER PROD SEGUN ID
productRouter.get('/:id', (req, res) => {
    const id = req.params.id

    productosApi.getById(id)
        .then(idProd => {
            // Verifico que el producto exista
            res.send(idProd)
        })
        .catch(
            res.send({ error: "Product not found" })
        )

})

// RECIBE Y AGREGA UN PRODUCTO, LO DEVUELVE CON SU ID ASIGNADO
productRouter.post('/', (req, res) => {
    const newProduct = req.body

    const administrador = newProduct.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })
    } else {
        productosApi.create(newProduct)
            .then(saveProduct => res.send(saveProduct))

    }


})

// RECIBE Y ACTUALIZA UN PRODUCTO SEGUN SU ID
productRouter.put('/:id', (req, res) => {

    const modProduct = req.body

    const administrador = modProduct.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })

    } else {

        const id = req.params.id

        productosApi.modifyProduct(modProduct, id)
            .then((response) => res.send(response))
            .catch((response) => res.send(response))

    }

})

// ELIMINA UN PRODUCTO SEGUN SU ID
productRouter.delete('/:id', (req, res) => {

    const administrador = req.body.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })
    } else {

        const id = req.params.id

        productosApi.deleteById(id)
            .then(deletedProd => {
                if (deletedProd) {
                    res.send("The product has been deleted")
                } else {
                    res.send("Sorry, product was not found!")
                }

            })

    }

})

// CART --------------------------------------------------------------------------------------------------------------------

// CREA UN CARRITO Y DEVUELVE EL ID
cartRouter.post('/', (req, res) => {
    const newCart = {
        timestamp: Date.now(),
        productos: []
    }

    carritoApi.create(newCart)
        .then(savedCart => res.send(`Your cart ID: ${savedCart.id}`))


})

//VACIA UN CARRITO Y LO ELIMINA
cartRouter.delete('/:id', (req, res) => {

   
    const id = req.params.id

    carritoApi.deleteById(id)
        .then(deletedCart => {
            if (deletedCart) {
                res.send("The cart has been deleted")
            } else {
                res.send({ error: "Cart was not found!" })
            }
        })

})

// LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
cartRouter.get("/:id/productos", (req, res) => {

    const id = req.params.id

    carritoApi.getById(id)
        // .then(cart => {
        //     if (cart) {
        //         if (cart.products.length !== 0) {
        //             res.send(cart.products)
        //         } else {
        //             res.send("No products where found in this cart :(")
        //         }
        //     } else {
        //         res.send({ error: "The cart ID is incorrect" })
        //     }
        // })
        .then(cart => res.send(cart.productos))
        .catch(err => res.send(err))

})

//AGREGAR UN PRODUCTO AL CARRITO POR SU ID

cartRouter.post("/:id/productos", (req, res) => {
  
    const id = req.params.id

    const prodID = req.body.id

    productosApi.getById(prodID)
    .then((product) => {
        carritoApi.addProduct(id,product)
        .then(() => res.send("Product added"))
        .catch((e) => res.send(e))
    })
    .catch((e) => res.send(e))
        // .then(product => {

        //     // Verifico que el producto exista
        //     if (!product) {
        //         res.send({ error: "Producto no encontrado" })
        //     } else {
        //         carritoApi.addProduct(id, product)
        //             .then(cart => {
        //                 if (cart) {
        //                     res.send("Your product has been added to the cart!")
        //                 } else {
        //                     res.send({ error: "The cart ID is incorrect" })
        //                 }
        //             })

        //     }
        // })


})

// ELIMINAR UN PRODUCTO DEL CARRITO POR SU ID DE CARRITO Y DE PRODUCTO

cartRouter.delete("/:id/productos/:id_prod", (req, res) => {

    const cartID = req.params.id
    const prodID = req.params.id_prod

    carritoApi.deleteProduct(cartID, prodID)
    
        .then(cart => res.send(`${cart} has been deleted from the cart`))
        .catch(resp => res.send(resp))

})




//--------------------------------------------------------------------------------------------------------------------

// VARIABLES SERVIDOR
app.use('/api/productos', productRouter)

app.use('/api/carrito', cartRouter)

app.get('*', (req, res) => {
    res.send({
        error: "Route not implemented"
    })
})

const PORT = configs.port

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

// DB CONNECTIONS

const db = configs.db
