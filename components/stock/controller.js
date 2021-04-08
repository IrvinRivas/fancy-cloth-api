const store = require('./store');

const addInventary = async(data) => {
    return await store.add(data)
}

const getSizesByProduct = async (product) => {
    return await store.getSizes(product)
}

const getAll = async () => {
    return await store.get()
}

const getNotAvailable = async () => {
    return await store.getNotAvailable();
}

module.exports = {
    add: addInventary,
    getSizes: getSizesByProduct,
    get: getAll,
    getNotAvailable,
}