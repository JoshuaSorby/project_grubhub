const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function orderExists (req, res, next) {
    const orderId = req.params.orderId;
    const foundOrderId = orders.find((order) => order.id == orderId)
    if (foundOrderId) {
        res.locals.order = foundOrderId;
        next();
    }
    return next({
        status: 404,
        message: `The orderId "${orderId}" does not exist.`
    })

}

function dishesHasQuantity (req, res, next) {
    const dishes = req.body.data.dishes;
    dishes.forEach((dish) => {
        if (!dish.quantity || dish.quantity < 1)
        {
            return next({
                status: 400,
                message: `There must me a quantity of at least 1. The current quantity is ${dish.quantity}`
            });
        }
        if (typeof dish.quantity !== 'number') {
            return next({
                status: 400,
                message: `The quantity at index ${dishes.indexOf(dish)} is not a number.`
            });
        }
    })
    next();
}

function dishesArrayExists (req, res, next) {
    const foundDishes = req.body.data.dishes;
    if (foundDishes.length > 0 && Array.isArray(foundDishes) == true) {
        return next()
    };
    next({
        status: 400,
        message: `dishes is not an array.`
    });
}

function dishesExists (req, res, next) {
    const foundDishes = req.body.data.dishes;
    if (foundDishes) next();
    return next({
        status: 400,
        message: `There is no dishes.`
    });
}

function deliverToExists (req, res, next) {
    const foundDeliverTo = req.body.data.deliverTo;
    if (foundDeliverTo) next();
    return next({
        status: 400,
        message: `There is no deliverTo address.`
    });
};

function statusExists (req, res, next) {
    const foundStatus = req.body.data.status;
    if (foundStatus && foundStatus !== 'invalid') next();
    return next({
        status: 400,
        message: `There is no status.`
    });
};

function mobileNumberExists (req, res, next) {
    const foundMobileNumber = req.body.data.mobileNumber;
    if (foundMobileNumber) next();
    return next({
        status: 400,
        message: `There is no mobileNumber.`
    });
};

function idMatches (req, res, next) {
    const foundId = req.body.data.id;
    if (foundId && foundId !== req.params.orderId) {
        return next({
            status: 400,
            message: `id ${req.body.data.id} does not match.`
        })
    } next ();
} 

function list (req, res, next) {
    res.json({data: orders})
}

function create (req, res, next) {
    const newOrder = {
        id : nextId(),
        deliverTo: req.body.data.deliverTo,
        mobileNumber: req.body.data.mobileNumber,
        status: req.body.data.status,
        dishes: req.body.data.dishes
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder})
}

function read (req, res, next) {
    res.json({data: res.locals.order})
}

function update (req, res, next) {
    res.locals.order.id = req.params.orderId;
    res.locals.order.deliverTo = req.body.data.deliverTo;
    res.locals.order.mobileNumber = req.body.data.mobileNumber;
    res.locals.order.status = req.body.data.status;
    res.locals.order.dishes = req.body.data.dishes;

    res.json({data: res.locals.order})
}

function destroy (req, res, next) {
    const index = orders.findIndex((order) => res.locals.order.id == order.id)
    if (res.locals.order.status !== "pending"){
        return next({
            status: 400,
            message: `Status pending.`
        })
    }
    if (index > -1) {
        orders.splice(index, 1);
    }
    res.sendStatus(204);
}
module.exports = {
    list,
    create: [mobileNumberExists, deliverToExists, dishesExists, dishesArrayExists, dishesHasQuantity, create],
    read: [orderExists, read],
    update: [orderExists, mobileNumberExists, deliverToExists, statusExists, dishesExists, dishesArrayExists, dishesHasQuantity, idMatches, update],
    delete: [orderExists, destroy]
   
}