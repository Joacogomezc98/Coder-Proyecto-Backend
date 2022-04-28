import mongoose from "mongoose";


export default class ContenedorMongo {
    constructor(collection, schema){
        this.collection = mongoose.model(collection, schema)
        this.mongoConnect()
    }

    async mongoConnect() {
        try{
            mongoose.connect("mongodb://localhost:27017/mibase",{
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log("conectado a MongoDB")
        }
        catch (error){
            console.log(error)
        }
    }
    

    async getAll() {
        try{
            const items = await this.collection.find()
            return items
        }catch(e){
            throw new Error(e)
        }
    }

    async getById(id) {
        try{
            const item = await this.collection.findOne({'_id': id})
            return item
        }catch(e){
            console.log(e)
            const item = false
            return item
        }
    }

    async deleteById(id) {
        try{
            const deletedItem = await this.collection.findOneAndDelete({"_id": id})
            return deletedItem
        }catch(e){
            throw new Error("Id not found")
        }
    }

    async create(item){
        try{

            const newItem = await this.collection.create(item)
            return newItem
        }catch(e){
            throw new Error(`Error al guardar: ${e}`)
        }
    }

}