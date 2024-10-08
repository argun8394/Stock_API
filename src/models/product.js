"use strict"
/* ----------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')

/* ------------------------------------------------------- *
{
    "category_id": "65343222b67e9681f937f203",
    "brand_id": "65343222b67e9681f937f107",
    "name": "Product 1"
}
/* ------------------------------------------------------- */
// Product Model:

const ProductSchema = new mongoose.Schema({

    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    name: {
        type: String,
        trim: true,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    }

}, { collection: 'products', timestamps: true })

/* ------------------------------------------------------- */

ProductSchema.pre('init', function (data) {
    data.id = data._id
    data.createds = data.createdAt.toLocaleDateString('tr-tr')
})
/* ------------------------------------------------------- */
module.exports = mongoose.model('Product', ProductSchema)