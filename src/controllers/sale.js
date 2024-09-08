"use strict"
/* ---------------------------------------------------- */
// Sale Controller:

const Product = require('../models/product')
const Sale = require('../models/sale')

module.exports = {

    list: async (req, res) => {

        const data = await res.getModelList(Sale, {}, ['brand_id', 'product_id'])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Sale),
            data
        })

        // res.status(200).send(data)
    },

    create: async (req, res) => {

         // Auto add user_id to req.body:
         req.body.user_id = req.user?._id

         // get stock info:
         const currentProduct = await Product.findOne({ _id: req.body.product_id })
 
         if (currentProduct.stock >= req.body.quantity) { // Check Limit
 
             // Create:
             const data = await Sale.create(req.body)
 
             // set stock (quantity) when Sale process:
             const updateProduct = await Product.updateOne({ _id: data.product_id }, { $inc: { stock: -data.quantity } })
 
             res.status(201).send({
                 error: false,
                 data,
             })
 
         } else {
 
             res.errorStatusCode = 422
             throw new Error('There is not enough stock for this sale.', { cause: { currentProduct } })
         }
    },

    read: async (req, res) => {

        const data = await Sale.findOne({ _id: req.params.id }).populate(['brand_id', 'product_id'])

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {

        if (req.body?.quantity) {
            // get current stock quantity from the Sale:
            const currentSale = await Sale.findOne({ _id: req.params.id })
            // different:
            const quantity = req.body.quantity - currentSale.quantity
            // console.log(quantity)

            // set stock (quantity) when Sale process:
           const updateProduct = await Product.updateOne({ _id: currentSale.product_id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })
            // console.log(updateProduct)
            
            // if stock limit not enough:
            if (updateProduct.modifiedCount == 0) { // Check Limit
                res.errorStatusCode = 422
                throw new Error('There is not enough stock for this sale.')
            }
        }

        // Update:
        const data = await Sale.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Sale.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {

         // get current stock quantity from the Sale:
         const currentSale = await Sale.findOne({ _id: req.params.id })
         // console.log(currentSale)
 
         // Delete:
         const data = await Sale.deleteOne({ _id: req.params.id })
 
         // set stock (quantity) when Sale process:
         const updateProduct = await Product.updateOne({ _id: currentSale.product_id }, { $inc: { stock: +currentSale.quantity } })
 
         res.status(data.deletedCount ? 204 : 404).send({
             error: !data.deletedCount,
             data
         })
    },
}