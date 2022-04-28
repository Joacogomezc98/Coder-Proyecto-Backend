import mongoose from "mongoose";


const CarritosSchema = new mongoose.Schema({
    timestamp: {type: Date, required: true},
    products: {type: Array, required: false, max: 100}
})

export default CarritosSchema