import mongoose from "mongoose";


const ProductosSchema = new mongoose.Schema({
    title: {type: String, required: true, max: 100},
    price: {type: Number, required: true, max: 100000},
    stock: {type: Number, required: true, max: 100},
    thumbnail: {type: String, required: true, max: 100},
    timestamp: {type: String, required: true},


})

export default ProductosSchema