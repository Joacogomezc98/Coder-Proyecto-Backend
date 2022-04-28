import ContenedorMongo from "../../contenedores/contenedorMongoDb.js"
import CarritosSchema from "../../schemas/carritosSchema.js"

class CarritosMongo extends ContenedorMongo {
    constructor(){
        super("carritos", CarritosSchema)
     }

     async addProduct(id, product){
         try{
             const updatedCart =  await this.collection.findOneAndUpdate({"_id": id},{$push: {"products": product}})
             return updatedCart
         }catch(e){
             console.log(e)
         }
     }

     async deleteProduct(cartID, prodID){
         try{
             const deletedCart = await this.collection.findOneAndUpdate({"_id": cartID},{$pull: {"products":{"_id": prodID}}})
             return deletedCart
         }catch(e){
             console.log(e)
             return ("Something Went Wrong")
         }
     }

}

export default CarritosMongo