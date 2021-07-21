const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function nameExists (req, res, next) {
    const foundName = req.body.data.name;
    if (foundName) next();
    return next({
        status: 400,
        message: `There is no name.`
    })
}

function descriptionExists (req, res, next) {
    const foundDescription = req.body.data.description;
    if (foundDescription) next();
    return next({
        status: 400,
        message: `There is no description.`
    })
}

function urlExists (req, res, next) {
    const foundUrl = req.body.data.image_url;
    if (foundUrl) next();
    return next({
        status: 400,
        message: `There is no image_url.`
    })
}

function priceExists (req, res, next) {
    const foundPrice = req.body.data.price;
    if ((typeof foundPrice) !== "number" ) {
        return next({
            status: 400,
            message: `There is no price.`
        })
    }
    if (foundPrice && Number(foundPrice) > 0) next();
    return next({
        status: 400,
        message: `There is no price.`
    })
}

function idMatches (req, res, next) {
    const foundId = req.body.data.id;
    if (foundId && foundId !== req.params.dishId) {
        return next({
            status: 400,
            message: `id ${req.body.data.id} does not match.`
        })
    } next ();
}

function list (req, res, next) {
    res.json({data: dishes})
}

function create (req, res, next) {
    const work = req.body.data.name
    const newDish = {
        id: nextId(),
        name: work,
        description: req.body.data.description,
        price: req.body.data.price,
        image_url: req.body.data.image_url,
    }
    dishes.push(newDish);
    res.status(201).json({data: newDish});
};

function dishExists (req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId)
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    }
    return next({
        status: 404,
        message: `There is no dishId.`
    })

}

function read (req, res, next) {
    res.json({data: res.locals.dish})
}

function update (req, res, next) {
    res.locals.dish.id = req.body.data.id;
    res.locals.dish.name = req.body.data.name;
    res.locals.dish.description = req.body.data.description;
    res.locals.dish.price = req.body.data.price;
    res.locals.dish.image_url = req.body.data.image_url;

    res.json({data: res.locals.dish})
}

module.exports = {
    list,
    create: [nameExists, descriptionExists, urlExists, priceExists, create],
    read: [dishExists, read],
    update: [dishExists, nameExists, descriptionExists, priceExists, urlExists, idMatches, update]
}