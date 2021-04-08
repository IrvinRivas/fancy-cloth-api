const store = require('./store');
const { nanoid } = require('nanoid');

const getById = async (id) => {
    return await store.getById(id)
}

const addOrder = async (data,products) => {
    const idOrder = nanoid();
    const newOrder = {
        id: idOrder,
        date: new Date(),
        ...data
    }

    let newProducts = [];

    products.map(product => (
        newProducts.push({
            id_order: idOrder,
            id_product: product.id_product,
            amount: product.amount,
            size: product.size,
        })
    ))

    return await store.add(newOrder,newProducts);
}

const getByUser = async (user) => {
    return await store.getByUser(user);
}

const getByStatus = async (status) => {
    return await store.status(status);
}

const getProductsOrder = async (order) => {
    return await store.getProductsOrder(order);
}

const updateOrderData = async (order,data) => {
    return await store.update(order,data);
}

const getOrderFilter = async (initial,final,status) => {
    return await store.getOrderFilter(initial,final,status)
}

const getAmountTotal = async () => {
    return await store.getAmountTotal();
}

const getAmountByTime = async(initial,final) => {
    return await store.getAmountByTime(initial,final);
}

module.exports = {
    getById,
    add: addOrder,
    getByUser,
    status: getByStatus,
    getProductsOrder,
    update: updateOrderData,
    getOrderFilter,
    getAmountTotal,
    getAmountByTime
}