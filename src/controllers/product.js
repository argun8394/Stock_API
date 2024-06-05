"use strict"
/* ---------------------------------------------------- */
// Product Controller:

const Product = require('../models/product')

module.exports = {

    list: async (req, res) => {

        const data = await res.getModelList(Product, {}, ['category_id', 'brand_id'])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Product),
            data
        })


        // res.status(200).send(data)
    },

    create: async (req, res) => {

        const data = await Product.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {

        const data = await Product.findOne({ _id: req.params.id }).populate(['category_id', 'brand_id'])

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {

        const data = await Product.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Product.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {

        const data = await Product.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}