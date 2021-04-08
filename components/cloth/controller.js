const store = require('./store');
const { nanoid } = require('nanoid');

const addProduct = async(product) => {
    const idProduct = nanoid();
    const newProduct = {
        id: idProduct,
        ...product
    }
    return await store.add(newProduct);
} 

const getProducts = async () => {
    return await store.getProducts()
}


module.exports= {
    addProduct,
    getProducts
}