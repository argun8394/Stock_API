"use strict"
/* --------------------------------------------------- */

// Purchase Controller:

const Product = require('../models/product')
const Purchase = require('../models/purchase')

module.exports = {

    list: async (req, res) => {

        const data = await res.getModelList(Purchase, {}, ['firm_id', 'brand_id', 'product_id'])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Purchase),
            data
        })

        // res.status(200).send(data)
    },

    create: async (req, res) => {

        // Auto add user_id to req.body:
        req.body.user_id = req.user?._id

        const data = await Purchase.create(req.body)

        //update stock
        const updateProduct = await Product.updateOne({ _id: data.product_id }, { $inc: { stock: +data.quantity } }) 

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {

        const data = await Purchase.findOne({ _id: req.params.id }).populate(['firm_id', 'brand_id', 'product_id'])

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {

        const data = await Purchase.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Purchase.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {

        const data = await Purchase.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}