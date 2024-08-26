"use strict"
/* -------------------------------------------------- */
// User Controller:

const User = require('../models/user')

module.exports = {

    list: async (req, res) => {
       

        const filters = (req.user?.is_superadmin) ? {} : { _id: req.user._id }

        const data = await res.getModelList(User, filters)

        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(User),
        //     data
        // })
        res.status(200).send(data)
        
        
    },

    create: async (req, res) => {
       

        // Disallow setting admin/staff:
        req.body.is_staff = false
        req.body.is_superadmin = false

        const data = await User.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
       
        const filters = (req.user?.is_superadmin) ? { _id: req.params.id } : { _id: req.user._id }

        const data = await User.findOne(filters)

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
     
        const filters = (req.user?.is_superadmin) ? { _id: req.params.id } : { _id: req.user._id }
        req.body.is_superadmin = (req.user?.is_superadmin) ? req.body.is_superadmin : false

        const data = await User.updateOne(filters, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await User.findOne(filters)
        })
    },

    delete: async (req, res) => {
        
        const filters = (req.user?.is_superadmin) ? { _id: req.params.id } : { _id: req.user._id } 

        const data = await User.deleteOne(filters)

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}