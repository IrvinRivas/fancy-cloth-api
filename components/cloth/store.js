const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection({
    host:config.mysql.host,
    user:config.mysql.user,
    password:config.mysql.password,
    database:config.mysql.database
})

const addProduct = (data) => {
    return new Promise((resolve,reject) => {
        connection.query(`INSERT INTO PRODUCTS SET ?`,data,(err,results) => {
            if(err){
                reject('Error al ingresar el producto');
            }else{
                resolve('Producto agregado correctamente');
            }
        })
    })
}

const getProducts = () => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM PRODUCTS`,(err,results) => {
            if(err){
                reject('Error Interno');
            }else{
                resolve(results);
            }
        })
        
    })
}

module.exports = {
    add:addProduct,
    getProducts,
}