const logger = require('../../services/logger.service')
const orderService = require('./order.service')
const socketService = require('../../services/socket.service')

async function getOrders(req, res) {
    if(!req.loggedinUser){
        res.status(401).send({ err: 'Not user found' })
        return
    }
    try {
        const userId = req.loggedinUser._id
        const orders = await orderService.query(userId)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function addOrder(req, res) {
    if(!req.loggedinUser){
        res.status(401).send({ err: 'Not user found' })
        return
    }

    try {
        var order = req.body
        order = await orderService.add(order)
        res.send(order)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function updateOrder(req, res) {
    try {
        const order = req.body
        const updatedOrder = await orderService.update(order)
        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

module.exports = {
    getOrders,
    updateOrder,
    addOrder
}