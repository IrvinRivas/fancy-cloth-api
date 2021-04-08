const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection({
    host:config.mysql.host,
    user:config.mysql.user,
    password:config.mysql.password,
    database:config.mysql.database
})

const getById = (id) => {
    return new Promise((resolve,reejct) => {
        connection.query(`SELECT * FROM orders INNER JOIN product_order ON orders.id = product_order.id_order WHERE ORDERS.ID='${id}'`,(err,results) => {
            if (err) {
                reject('No hay data')
            }else{
                resolve(results)
            }
        })
    })
}

const addOrder = (order) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO ORDERS SET ?',order,(err,results) => {
            if(err){
                reject('Error crear la orden');  
            }else{
                resolve()
            }
        })
    })
}

const updateStock = (product,size,amount) => {
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE STOCK SET AMOUNT = AMOUNT-${amount} WHERE PRODUCT = '${product}' AND SIZE = '${size}'`,(err,results) => {
            if (err) {
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

const addProductsToOrder = (products) => {
    return new Promise((resolve,reject) => {
        for (let i = 0; i < products.length; i++) {
            updateStock(products[i].id_product, products[i].size, products[i].amount)
                .then(() => {
                    resolve('hecho')
                    connection.query('INSERT INTO PRODUCT_ORDER SET ?',products[i],(err,results) => {
                        if(err){
                            reject(err);
                        }else{
                            resolve()
                        }
                    })
                })
                .catch('Ups este Producto se ha acabado de ultimo momento')
        }
    })
}

const add = (order,products) => {
    return new Promise((resolve,reject) => {
        addOrder(order)
            .then(() => {
                addProductsToOrder(products)
                    .then(() => resolve('Compra exitosa'))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    })

}

const getByUser = (user) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM ORDERS WHERE USER='${user}'`,(err,results) => {
            if (err) {
                reject('No has hecho ningun pedido aun')
            }else{
                resolve(results);
            }
        })
    }) 
}

const getByStatus = (status) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM ORDERS WHERE STATUS='${status}'`,(err,results) => {
            if (results) {
                resolve(results)
            }else{
                reject('no hay pedidos')
            }
        })
    }) 
}

const getProductsOrder = (order) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM PRODUCT_ORDER WHERE ID_ORDER='${order}'`,(err,results) => {
            if (results.length > 0) {
                resolve(results)
            }else{
                reject('no hay ningun producto en este pedido')
            }
        })
    })
}

const updateOrderData = (order,data) => {
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE ORDERS SET ? WHERE ID='${order}'`,data,(err,results) => {
            if (err) {
                reject('Error al actualizar informacion de envio')
            }else{
                resolve('Datos de envio actualizado correctamente');
            }
        })
    })
}


const getOrderFilter = (initial,final,status) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM ORDERS WHERE STATUS='${status}' AND  DATE BETWEEN '${initial} 00:00:00' AND '${final} 23:59:59'`, (err,results) => {
            if (results.length > 0) {
                resolve(results)
            }else{
                reject('No hay ordenes con estos parametros')
            }
        })
    })
}

/* analitycs --------------*/
const getAmountTotal = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT SUM(AMOUNT) FROM ORDERS',(err,results) =>{
            if (results) {
                resolve(results[0])
            }else{
                reject('Error interno')
            }
        })
    })
}

/* const getAmountByProduct = (initial, final, product) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT SUM(AMOUNT) FROM ORDERS WHERE DATE BETWEEN`)
    })
} */

const getAmountByTime = (initial,final) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT SUM(AMOUNT) FROM ORDERS WHERE DATE BETWEEN '${initial} 00:00:00' AND '${final} 23:59:59'`,(err,results) => {
            if (results) {
                resolve(results[0])
            }else{
                /* reject('No hay ventas en este lapso de tiempo') */
                reject(err)
            }
        })
    })
}

module.exports = {
    getById,
    add,
    getByUser,
    status: getByStatus,
    getProductsOrder,
    update: updateOrderData,
    getOrderFilter,
    getAmountTotal,
    getAmountByTime,
}